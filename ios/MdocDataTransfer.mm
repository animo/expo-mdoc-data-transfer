#import "MdocDataTransfer.h"
#import "MdocDataTransfer/MdocDataTransfer-Swift.h"

static MdocDataTransferImpl *mdoc_data_transfer = [MdocDataTransferImpl new];

// NOTE: to make this library compatible with both the new AND old architecture
// we define all methods twice.

@implementation MdocDataTransfer
RCT_EXPORT_MODULE()

// New architecture methods
#ifdef RCT_NEW_ARCH_ENABLED
- (NSString *)hello {
    return [mdoc_data_transfer doSomethingWithMdoc];
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeMdocDataTransferSpecJSI>(params);
}

// Old architecture methods
#else

// For old architecture we need to use async methods
 RCT_EXPORT_METHOD(hello:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    NSString *message = [mdoc_data_transfer doSomethingWithMdoc];
    resolve(message);
}

//RCT_EXPORT_SYNCHRONOUS_TYPED_METHOD(NSString *, hello)
//{
//    return [mdoc_data_transfer doSomethingWithMdoc];
//}
#endif

@end
