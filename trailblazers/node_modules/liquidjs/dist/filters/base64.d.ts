/**
 * Base64 related filters
 *
 * Implements base64_encode and base64_decode filters for Shopify compatibility
 */
import { FilterImpl } from '../template';
export declare function base64_encode(this: FilterImpl, value: string): string;
export declare function base64_decode(this: FilterImpl, value: string): string;
