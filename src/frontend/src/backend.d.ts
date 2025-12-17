import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Pin {
    latitude: number;
    memo: string;
    longitude: number;
}
export interface backendInterface {
    createPin(latitude: number, longitude: number, memo: string): Promise<bigint>;
    getAllPins(): Promise<Array<[bigint, Pin]>>;
    getPin(pinId: bigint): Promise<Pin>;
    getPinsByLocationRange(latMin: number, latMax: number, longMin: number, longMax: number): Promise<Array<[bigint, Pin]>>;
}
