import { BootMode, V158DeviceConnection } from '../types/v158';

export class DeviceAdapterService {
  private currentConnection: V158DeviceConnection = {
    isConnected: true,
    bootMode: 'NORMAL',
    serialNumber: 'R5CW30XYZ89',
    modelDetected: 'SM-S928B',
    boardDetected: 'SM-S928B-REV-01',
    androidVersion: 'Android 14 (One UI 6.1)',
    securityPatch: '2026-08-01',
    batteryLevel: 68,
    isAuthorized: true,
    unsupportedOperations: ['MODIFY_PROTECTED_IMEI', 'OVERWRITE_RPMB'],
  };

  public getConnection(): V158DeviceConnection {
    return { ...this.currentConnection };
  }

  public simulateBootModeChange(mode: BootMode) {
    this.currentConnection.bootMode = mode;
    this.currentConnection.isConnected = mode !== 'DISCONNECTED';
  }

  public toggleConnection(connected: boolean) {
    this.currentConnection.isConnected = connected;
    if (!connected) {
      this.currentConnection.bootMode = 'DISCONNECTED';
    } else {
      this.currentConnection.bootMode = 'NORMAL';
    }
  }
}

export const deviceAdapter = new DeviceAdapterService();
