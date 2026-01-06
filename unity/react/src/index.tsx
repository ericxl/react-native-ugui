import { render } from '@reactunity/renderer';
import { useGameState, ACTIONS, GameAction } from './useGameState';

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <view style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
      <text style={{ color: 'white', width: 80, fontSize: 14 }}>{label}</text>
      <view style={{ flex: '1', height: 20, backgroundColor: '#2c3e50', borderRadius: 4, overflow: 'hidden', marginLeft: 8, marginRight: 8 }}>
        <view style={{ width: `${pct}%`, height: '100%', backgroundColor: color, borderRadius: 4 }} />
      </view>
      <text style={{ color: 'white', width: 40, fontSize: 14, textAlign: 'right' }}>{Math.round(value)}</text>
    </view>
  );
}

function ActionButton({ action, disabled, onClick }: { action: GameAction; disabled: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: disabled ? '#555' : action.color,
        color: 'white',
        padding: '10px 16px',
        margin: 4,
        borderRadius: 6,
        fontSize: 14,
        fontWeight: 'bold',
        opacity: disabled ? 0.5 : 1,
        minWidth: 80,
      }}
    >
      {action.label}
    </button>
  );
}

function GameOver({ reason, day, onRestart }: { reason: string; day: number; onRestart: () => void }) {
  return (
    <view style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <text style={{ color: '#e74c3c', fontSize: 32, fontWeight: 'bold', marginBottom: 16 }}>Game Over</text>
      <text style={{ color: 'white', fontSize: 18, marginBottom: 8, textAlign: 'center' }}>{reason}</text>
      <text style={{ color: '#95a5a6', fontSize: 16, marginBottom: 24 }}>You survived {day} day{day !== 1 ? 's' : ''}</text>
      <button onClick={onRestart} style={{ backgroundColor: '#27ae60', color: 'white', padding: '12px 32px', borderRadius: 8, fontSize: 16, fontWeight: 'bold' }}>
        Play Again
      </button>
    </view>
  );
}

function App() {
  const { state, performAction, resetGame, canPerformAction } = useGameState();

  return (
    <view style={{ backgroundColor: '#1a1a2e', padding: 20, minHeight: '100%', position: 'relative' }}>
      <view style={{ backgroundColor: '#16213e', padding: 16, borderRadius: 8, marginBottom: 16 }}>
        <text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 4 }}>Life Sim</text>
        <text style={{ color: '#95a5a6', fontSize: 16, textAlign: 'center' }}>Day {state.day} - {state.hour.toString().padStart(2, '0')}:00</text>
      </view>

      <view style={{ backgroundColor: '#16213e', padding: 16, borderRadius: 8, marginBottom: 16 }}>
        <StatBar label="Energy" value={state.energy} color="#3498db" />
        <StatBar label="Hunger" value={state.hunger} color="#e67e22" />
        <StatBar label="Happiness" value={state.happiness} color="#e91e63" />
        <view style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#2c3e50' }}>
          <text style={{ color: 'white', fontSize: 14 }}>Money:</text>
          <text style={{ color: '#27ae60', fontSize: 18, fontWeight: 'bold', marginLeft: 8 }}>${state.money}</text>
        </view>
      </view>

      <view style={{ backgroundColor: '#16213e', padding: 16, borderRadius: 8 }}>
        <text style={{ color: '#95a5a6', fontSize: 14, marginBottom: 12 }}>Actions</text>
        <view style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
          {ACTIONS.map((action) => (
            <ActionButton key={action.name} action={action} disabled={!canPerformAction(action)} onClick={() => performAction(action)} />
          ))}
        </view>
      </view>

      {state.isGameOver && state.gameOverReason && (
        <GameOver reason={state.gameOverReason} day={state.day} onRestart={resetGame} />
      )}
    </view>
  );
}

render(<App />);
