
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNMdocDataTransferSpec.h"

@interface MdocDataTransfer : NSObject <NativeMdocDataTransferSpec>
#else
#import <React/RCTBridgeModule.h>

@interface MdocDataTransfer : NSObject <RCTBridgeModule>
#endif

@end
