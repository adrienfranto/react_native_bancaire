import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Battery from 'expo-battery';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { useTheme } from '../context/ThemeContext';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type BatteryInfo = {
  level: number; // 0-1
  state: Battery.BatteryState;
};

type NetworkInfo = {
  type: string; // 'wifi' | 'cellular' | 'none' | 'unknown'
  isConnected: boolean;
};

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function getTimeString(): string {
  const now = new Date();
  return now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function getBatteryIcon(level: number, state: Battery.BatteryState): React.ComponentProps<typeof Ionicons>['name'] {
  const isCharging =
    state === Battery.BatteryState.CHARGING ||
    state === Battery.BatteryState.FULL;

  if (isCharging) return 'battery-charging';
  if (level >= 0.9) return 'battery-full';
  if (level >= 0.6) return 'battery-half';
  if (level >= 0.3) return 'battery-half'; // medium
  return 'battery-dead';
}

function getBatteryColor(level: number, state: Battery.BatteryState): string {
  if (state === Battery.BatteryState.CHARGING || state === Battery.BatteryState.FULL) {
    return '#10B981'; // green charging
  }
  if (level <= 0.2) return '#EF4444'; // red critical
  if (level <= 0.4) return '#F59E0B'; // orange low
  return 'rgba(255,255,255,0.9)';
}

function getNetworkIcon(type: string, isConnected: boolean): React.ComponentProps<typeof Ionicons>['name'] {
  if (!isConnected) return 'cloud-offline-outline';
  if (type === 'wifi') return 'wifi';
  if (type === 'cellular') return 'cellular';
  return 'globe-outline';
}

function getNetworkLabel(type: string, isConnected: boolean): string {
  if (!isConnected) return 'Hors ligne';
  if (type === 'wifi') return 'WiFi';
  if (type === 'cellular') return '4G';
  return 'Net';
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
interface StatusBarBandProps {
  /** Couleur du texte/icônes — override auto-détection */
  iconColor?: string;
}

export const StatusBarBand: React.FC<StatusBarBandProps> = ({ iconColor }) => {
  const { isDarkMode } = useTheme();

  const [time, setTime] = useState(getTimeString());
  const [battery, setBattery] = useState<BatteryInfo | null>(null);
  const [network, setNetwork] = useState<NetworkInfo>({ type: 'unknown', isConnected: true });
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const tintColor = iconColor ?? 'rgba(255,255,255,0.9)';

  // ── Horloge (mise à jour chaque minute) ──────────
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTime(getTimeString());
    }, 10000); // 10s pour démo rapide, 60000 en prod
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // ── Batterie ─────────────────────────────────────
  useEffect(() => {
    let subscription: Battery.Subscription | null = null;

    async function initBattery() {
      try {
        const level = await Battery.getBatteryLevelAsync();
        const state = await Battery.getBatteryStateAsync();
        setBattery({ level, state });

        subscription = Battery.addBatteryStateListener(({ batteryState }) => {
          setBattery((prev) =>
            prev ? { ...prev, state: batteryState } : null
          );
        });
      } catch {
        // Batterie non disponible (simulateur, web)
        setBattery(null);
      }
    }

    initBattery();
    return () => {
      subscription?.remove();
    };
  }, []);

  // ── Réseau ────────────────────────────────────────
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setNetwork({
        type: state.type ?? 'unknown',
        isConnected: state.isConnected ?? false,
      });
    });

    NetInfo.fetch().then((state: NetInfoState) => {
      setNetwork({
        type: state.type ?? 'unknown',
        isConnected: state.isConnected ?? false,
      });
    });

    return () => unsubscribe();
  }, []);

  if (Platform.OS === 'web') return null;

  const batteryLevel = battery?.level ?? 0;
  const batteryState = battery?.state ?? Battery.BatteryState.UNKNOWN;
  const battPct = Math.round(batteryLevel * 100);
  const battColor = battery ? getBatteryColor(batteryLevel, batteryState) : tintColor;

  return (
    <View style={styles.band} pointerEvents="none">
      {/* Heure */}
      <Text style={[styles.time, { color: tintColor }]}>{time}</Text>

      {/* Réseau + Batterie groupés à droite */}
      <View style={styles.rightGroup}>
        {/* Réseau */}
        <View style={styles.indicator}>
          <Ionicons
            name={getNetworkIcon(network.type, network.isConnected)}
            size={13}
            color={network.isConnected ? tintColor : '#EF4444'}
          />
          <Text style={[styles.label, { color: network.isConnected ? tintColor : '#EF4444' }]}>
            {getNetworkLabel(network.type, network.isConnected)}
          </Text>
        </View>

        {/* Séparateur */}
        <View style={[styles.separator, { backgroundColor: tintColor }]} />

        {/* Batterie */}
        {battery !== null ? (
          <View style={styles.indicator}>
            <Ionicons
              name={getBatteryIcon(batteryLevel, batteryState)}
              size={15}
              color={battColor}
            />
            <Text style={[styles.label, { color: battColor }]}>{battPct}%</Text>
          </View>
        ) : (
          <Ionicons name="battery-half-outline" size={15} color={tintColor} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  band: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 4,
    height: 24,
  },
  time: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    fontVariant: ['tabular-nums'],
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  indicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  separator: {
    width: 1,
    height: 10,
    opacity: 0.4,
    borderRadius: 1,
  },
});
