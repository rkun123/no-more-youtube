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

WiFiMulti WiFiMulti;
WebSocketsServer webSocket = WebSocketsServer(81);

bool connecting = false;

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
            M5.Lcd.printf("[%u] Disconnected!\n", num);
            break;
        case WStype_CONNECTED:
            {
                IPAddress ip = webSocket.remoteIP(num);
                M5.Lcd.printf("[%u] Connected from %d.%d.%d.%d url: %s\n", num, ip[0], ip[1], ip[2], ip[3], payload);
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
  M5.Lcd.print("Dont move");
  mpu6050.begin();
  mpu6050.calcGyroOffsets(true);
  M5.Lcd.print("OK");
  M5.Lcd.setTextFont(2);
  M5.Lcd.setTextColor(TFT_WHITE, TFT_BLACK);
  M5.Lcd.println("M5Stack Balance Mode start");
  connecting = true;
}

void setup() {
  // Power ON Stabilizing...
    delay(500);
    M5.begin();

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
      M5.Lcd.clear();
      M5.Lcd.setCursor(0, 0);
      M5.Lcd.printf("Z: %f", nowZGyro);
      M5.Lcd.setCursor(0, 20);
      M5.Lcd.printf("speed: %f", (setZGyro-nowZGyro)/(nowTime-startTime));
      String ZGyro = String(nowZGyro);
      String Speed = String((setZGyro-nowZGyro)/(nowTime-startTime));
      String payload = ZGyro + "," + Speed;
      setZGyro = nowZGyro;
      startTime = nowTime;
      webSocket.broadcastTXT(payload);
      delay(5);
    } else {
      setZGyro = mpu6050.getAngleZ();
      startTime = millis();
    }
  }
  M5.update();
}
