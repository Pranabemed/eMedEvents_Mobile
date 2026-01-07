//
//  SpeechRecognition.m
//  eMedEvents
//
//  Created by eMed Events on 07/01/26.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(SpeechRecognition, RCTEventEmitter)

RCT_EXTERN_METHOD(startRecording)
RCT_EXTERN_METHOD(stopRecording)

@end
