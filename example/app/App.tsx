import { mdocDataTransfer, useMdocDataTransferShutdownOnUnmount } from '@animo-id/expo-mdoc-data-transfer'
import { useState } from 'react'
import { Button, Platform, View } from 'react-native'
import { type Permission, PermissionsAndroid } from 'react-native'

import QrCode from 'react-native-qrcode-svg'

const Pad = () => <View style={{ marginBottom: 10 }} />

const PERMISSIONS = [
  'android.permission.ACCESS_FINE_LOCATION',
  'android.permission.BLUETOOTH_CONNECT',
  'android.permission.BLUETOOTH_SCAN',
  'android.permission.BLUETOOTH_ADVERTISE',
  'android.permission.ACCESS_COARSE_LOCATION',
] as const as Permission[]

const requestPermissions = async () => PermissionsAndroid.requestMultiple(PERMISSIONS)

export const App = () => {
  const [qrCode, setQrCode] = useState<string>()
  const [mdt, setMdt] = useState<Awaited<ReturnType<typeof mdocDataTransfer.instance>>>()

  useMdocDataTransferShutdownOnUnmount()

  const start = async () => {
    try {
      const m = await mdocDataTransfer.instance('ma_service', [
        'MIIBxDCCAWugAwIBAgIQTn6+uOu5roCD/2HCc8v93TAKBggqhkjOPQQDAjAdMQ4wDAYDVQQDEwVBbmltbzELMAkGA1UEBhMCTkwwHhcNMjQwMzI0MTEzODM2WhcNMjgwMzI0MTEzODM2WjAdMQ4wDAYDVQQDEwVBbmltbzELMAkGA1UEBhMCTkwwWTATBgcqhkjOPQIBBggqhkjOPQMBBwNCAAQC/YyBpcRQX8ZXpHfra1TNdSbS7qzgHYHJ3msbIr8TJLPNZI8Ul8zJlFdQVIVls5+5ClCbN+J9FUvhPGs4AzA+o4GMMIGJMB0GA1UdDgQWBBQv3zBo1i/1CfEgdvkIWDGO9lS1SzAOBgNVHQ8BAf8EBAMCAQYwIQYDVR0SBBowGIYWaHR0cHM6Ly9mdW5rZS5hbmltby5pZDASBgNVHRMBAf8ECDAGAQH/AgEAMCEGA1UdHwQaMBgwFqAUoBKGEGh0dHBzOi8vYW5pbW8uaWQwCgYIKoZIzj0EAwIDRwAwRAIgWPX8NGiW1G7PwK+K7NVxd3h8DdZpZbB/u8GsXhvr4mACIF+DwCalXfWdu5tFM3iOJytQDPNOkFSnvE6eQK3x7BLG',
      ])
      setMdt(m)
    } catch (e) {
      console.error(e)
    }
  }
  const enableNfc = () => mdt?.enableNfc()
  const engagement = async () => {
    console.log(mdt)
    const qr = await mdt?.startQrEngagement()
    setQrCode(qr)
  }

  const sendDeviceResponse = async () => {
    await mdt?.sendDeviceResponse(new Uint8Array([1, 2, 3]))
    await mdt?.waitForDeviceRequest()
  }

  const shutdown = () => {
    mdt?.shutdown()
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {Platform.OS === 'android' && <Button title="request permissions" onPress={requestPermissions} />}
      <Pad />
      <Button title="start engagement" onPress={start} />
      <Pad />
      <Button title="enable nfc" onPress={enableNfc} />
      <Pad />
      <Button title="engagement" onPress={engagement} />
      <Pad />
      <Button title="send device desponse" onPress={sendDeviceResponse} />
      <Pad />
      <Button title="shutdown" onPress={shutdown} />
      <Pad />
      {qrCode && <QrCode value={qrCode} size={300} />}
    </View>
  )
}
