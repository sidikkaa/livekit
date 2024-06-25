'use client';

import { formatChatMessageLinks, LiveKitRoom, VideoConference } from '@livekit/components-react';
import {
  ExternalE2EEKeyProvider,
  LogLevel,
  Room,
  RoomConnectOptions,
  RoomOptions,
  VideoCodec,
  VideoPresets,
} from 'livekit-client';
import { useRouter } from 'next/router';
import { useMemo, useState, useEffect } from 'react';
import { decodePassphrase } from '../../lib/client-utils';
import { DebugMode } from '../../lib/Debug';
import Whiteboard from '../../components/Whiteboard';

export default function CustomRoomConnection() {
  const router = useRouter();
  const { liveKitUrl, token, codec } = router.query;
  const [showWhiteboard, setShowWhiteboard] = useState(false);

  const e2eePassphrase = useMemo(() => {
    return typeof window !== 'undefined' ? decodePassphrase(window.location.hash.substring(1)) : null;
  }, []);

  const worker = useMemo(() => {
    return typeof window !== 'undefined' ? new Worker(new URL('livekit-client/e2ee-worker', import.meta.url)) : null;
  }, []);

  const keyProvider = useMemo(() => new ExternalE2EEKeyProvider(), []);

  const e2eeEnabled = useMemo(() => {
    return !!(e2eePassphrase && worker);
  }, [e2eePassphrase, worker]);

  const roomOptions = useMemo((): RoomOptions => {
    return {
      publishDefaults: {
        videoSimulcastLayers: [VideoPresets.h540, VideoPresets.h216],
        red: !e2eeEnabled,
        videoCodec: codec as VideoCodec | undefined,
      },
      adaptiveStream: { pixelDensity: 'screen' },
      dynacast: true,
      e2ee: e2eeEnabled
        ? {
            keyProvider,
            worker,
          }
        : undefined,
    };
  }, [e2eeEnabled, codec, keyProvider, worker]);

  const room = useMemo(() => new Room(roomOptions), [roomOptions]);

  const connectOptions = useMemo((): RoomConnectOptions => {
    return {
      autoSubscribe: true,
    };
  }, []);

  useEffect(() => {
    if (e2eeEnabled) {
      keyProvider.setKey(e2eePassphrase);
      room.setE2EEEnabled(true).catch((error) => {
        console.error('Error enabling E2EE:', error);
      });
    }
  }, [e2eeEnabled, e2eePassphrase, keyProvider, room]);

  if (typeof liveKitUrl !== 'string') {
    return <h2>Missing LiveKit URL</h2>;
  }
  if (typeof token !== 'string') {
    return <h2>Missing LiveKit token</h2>;
  }

  return (
    <main data-lk-theme="default">
      {liveKitUrl && token && (
        <LiveKitRoom
          room={room}
          token={token}
          connectOptions={connectOptions}
          serverUrl={liveKitUrl}
          audio={true}
          video={true}
          onDisconnected={() => console.log('Disconnected from room')}
        >
          {showWhiteboard ? (
            <Whiteboard room={room} />
          ) : (
            <VideoConference chatMessageFormatter={formatChatMessageLinks} />
          )}
          <div className="controls">
            <button onClick={() => setShowWhiteboard(!showWhiteboard)}>
              {showWhiteboard ? 'Back to Conference' : 'Show Whiteboard'}
            </button>
          </div>
          <DebugMode logLevel={LogLevel.debug} />
        </LiveKitRoom>
      )}
    </main>
  );
}
