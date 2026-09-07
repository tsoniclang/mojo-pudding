import {
  equalRawPointer,
  hashRawPointer,
  loadNativePointer,
  offsetNativePointer,
  storeNativePointer,
  unsafeContext,
} from "@tsonic/core/lang.js";
import type { NativePointer, RawPointer, nativeInt, uint8 } from "@tsonic/core/types.js";

export function rawPointerSame(left: RawPointer | undefined, right: RawPointer | undefined): boolean {
  return equalRawPointer(left, right);
}

export function rawPointerHash(pointer: RawPointer | undefined): number {
  return hashRawPointer(pointer);
}

export function nativeByteCopy(source: NativePointer<uint8>, destination: NativePointer<uint8>): uint8 {
  unsafeContext();
  storeNativePointer(destination, loadNativePointer(source));
  return loadNativePointer(destination);
}

export function nativeByteOffset(pointer: NativePointer<uint8>, offset: nativeInt): NativePointer<uint8> {
  return unsafeContext(offsetNativePointer(pointer, offset));
}
