#include <Arduino.h>

#include <string>
#include <stdio.h>

#include <WiFi.h>
#include <WiFiMulti.h>
#include <WiFiClientSecure.h>

#include <M5Stack.h>

#include <WebSocketsServer.h>
#include <Wire.h>
#include <MPU6050_tockn.h>
MPU6050 mpu6050(Wire);

#define GPIO_PIN 25

WiFiMulti WiFiMulti;
WebSocketsServer webSocket = WebSocketsServer(81);

bool connecting = false;
float startDeg;

void hexdump(const void *mem, uint32_t len, uint8_t cols = 16) {
	const uint8_t* src = (const uint8_t*) mem;
	M5.Lcd.printf("\n[HEXDUMP] Address: 0x%08X len: 0x%X (%d)", (ptrdiff_t)src, len, len);
	for(uint32_t i = 0; i < len; i++) {
		if(i % cols == 0) {
			M5.Lcd.printf("\n[0x%08X] 0x%08X: ", (ptrdiff_t)src, i);
		}
		M5.Lcd.printf("%02X ", *src);
		src++;
	}
	M5.Lcd.printf("\n");
}

void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length) {

    switch(type) {
        case WStype_DISCONNECTED:
            M5.Lcd.clear();
            M5.Lcd.setCursor(10,85);
            M5.Lcd.printf("GoodBye!");
            connecting = false;
            break;
        case WStype_CONNECTED:
            {
                IPAddress ip = webSocket.remoteIP(num);
                calcGyroOffsets();

				// send message to client
        char payload1[9];
        String xGyro = String(mpu6050.getAccX());
        webSocket.broadcastTXT(xGyro);
            }
            break;
        case WStype_TEXT:
            M5.Lcd.printf("[%u] get Text: %s\n", num, payload);

            // send message to client
            // webSocket.sendTXT(num, "message here");

            // send data to all connected clients
            // webSocket.broadcastTXT("message here");
            break;
        case WStype_BIN:
            M5.Lcd.printf("[%u] get binary length: %u\n", num, length);
            hexdump(payload, length);

            // send message to client
            // webSocket.sendBIN(num, payload, length);
            break;
		case WStype_ERROR:			
		case WStype_FRAGMENT_TEXT_START:
		case WStype_FRAGMENT_BIN_START:
		case WStype_FRAGMENT:
		case WStype_FRAGMENT_FIN:
			break;
    }

}

void calcGyroOffsets() 
{
  M5.Lcd.clear();
  M5.Lcd.setCursor(10,95);
  M5.Lcd.setTextSize(5);
  M5.Lcd.printf("Dont Move!");
  M5.Speaker.tone(1318.510, 200);
  delay (400);
  M5.Speaker.mute();
  delay (400);
  M5.Speaker.tone(1318.510, 200);
  delay (400);
  M5.Speaker.mute();
  delay (400);
  M5.Speaker.tone(1318.510, 200);
  delay (400);
  M5.Speaker.mute();
  delay (400);
  M5.Speaker.tone(1318.510);
  mpu6050.begin();
  mpu6050.calcGyroOffsets(true);
  M5.Speaker.mute();
  connecting = true;
  M5.Lcd.clear();
}

void setup() {
  // Power ON Stabilizing...
    delay(500);
    M5.begin();
    M5.Speaker.begin();
    M5.Speaker.setVolume(3);
    
    Wire.begin();
    Wire.setClock(400000UL);

    for(uint8_t t = 4; t > 0; t--) {
        M5.Lcd.printf("[SETUP] BOOT WAIT %d...\n", t);
//        M5.Lcd.flush();
        delay(1000);
    }

    WiFiMulti.addAP("802ZTa-002967", "0107194a");

    while(WiFiMulti.run() != WL_CONNECTED) {
        delay(100);
    }
    M5.Lcd.println("Successed");
    M5.Lcd.println("IP: ");
    M5.Lcd.println(WiFi.localIP());
    
    webSocket.begin();
    
    webSocket.onEvent(webSocketEvent);
}

float setZGyro = 100.0;
unsigned long startTime;

void loop() {
  webSocket.loop();
  if (connecting) {
    mpu6050.update();
    if(setZGyro != 100.0){
      float nowZGyro = mpu6050.getAngleZ();
      unsigned long nowTime = millis();
      float setspeed = fabsf((setZGyro-nowZGyro)/(nowTime-startTime))*4.0; /* かける値は要変更 */
      M5.Lcd.setTextSize(6);
      M5.Lcd.setCursor(50,90);
      M5.Lcd.printf("%3.2f",setspeed );M5.Lcd.print(" x");
      String ZGyro = String(int(nowZGyro));
      String Speed = String(setspeed);
      String payload = ZGyro + "," + Speed;
      setZGyro = nowZGyro;
      startTime = nowTime;
      webSocket.broadcastTXT(payload);
      delay(100);
    } else {
      setZGyro = mpu6050.getAngleZ();
      startTime = millis();
    }
  }
  M5.update();
}
