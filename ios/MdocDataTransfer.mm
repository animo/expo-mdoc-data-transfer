#import "React/RCTBridgeModule.h"
#import "React/RCTEventEmitter.h"

@interface RCT_EXTERN_MODULE (MdocDataTransfer, RCTEventEmitter)

+ (BOOL)requiresMainQueueSetup {
    return NO;
}

RCT_EXTERN_METHOD(enableNfc)

RCT_EXTERN_METHOD(initialize:(NSString *)serviceName)

RCT_EXTERN_METHOD(startQrEngagement:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(sendDeviceResponse:(NSString)deviceResponse
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(shutdown)

@end
