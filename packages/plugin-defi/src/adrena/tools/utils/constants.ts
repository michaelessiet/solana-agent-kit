import { PublicKey } from "@solana/web3.js";

/**
 * Common token addresses used across the toolkit
 */
export const TOKENS = {
  SEND: new PublicKey("SENDdRQtYMWaQrBroBrJ2Q53fgVuq95CV9UPGEvpCxa"),
  USDC: new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
  USDT: new PublicKey("Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"),
  USDS: new PublicKey("USDSwr9ApdHk5bvJKMjzff41FfuX8bSxdKcR81vTwcA"),
  SOL: new PublicKey("So11111111111111111111111111111111111111112"),
  jitoSOL: new PublicKey("J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn"),
  bSOL: new PublicKey("bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1"),
  mSOL: new PublicKey("mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So"),
  BONK: new PublicKey("DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"),
} as const;

/**
 * Default configuration options
 * @property {number} SLIPPAGE_BPS - Default slippage tolerance in basis points (300 = 3%)
 * @property {number} TOKEN_DECIMALS - Default number of decimals for new tokens
 * @property {number} LEVERAGE_BPS - Default leverage for trading PERP
 */
export const DEFAULT_OPTIONS = {
  SLIPPAGE_BPS: 300,
  TOKEN_DECIMALS: 9,
  RERERRAL_FEE: 200,
  LEVERAGE_BPS: 50000, // 10000 = x1, 50000 = x5, 100000 = x10, 1000000 = x100
} as const;
