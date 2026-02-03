'use client'

import { useEffect, useState } from 'react'
import { useDailyRoutine } from '@/lib/hooks/use-portfolio-data'
import type { DailyRoutine } from '@/types'

/**
 * 24시간 아날로그 루틴 시계 컴포넌트
 * - KST 기준 현재 시간 표시
 * - 시간대별 루틴 시각화 (네온 효과)
 * - 시침/분침 실시간 회전
 * - 중앙 텍스트 "small-goliath" 표시
 */

// SVG 기본 설정
const CLOCK_CENTER_X = 200
const CLOCK_CENTER_Y = 200
const CLOCK_RADIUS = 180
const ROUTINE_ARC_RADIUS = 160
const ROUTINE_ARC_WIDTH = 30

// 시침/분침 설정
const HOUR_HAND_LENGTH = 100
const HOUR_HAND_WIDTH = 6
const MINUTE_HAND_LENGTH = 130
const MINUTE_HAND_WIDTH = 3

// 색상 매핑 (Tailwind CSS 변수)
const COLOR_MAP: Record<string, string> = {
  'neon-cyan': '#00f0ff',
  'neon-magenta': '#ff00ff',
  'neon-purple': '#9d00ff',
  'neon-green': '#00ff41',
  'neon-orange': '#ff6b00',
}

// 글로우 강도 매핑
const INTENSITY_MAP: Record<string, { opacity: number; blur: number }> = {
  dim: { opacity: 0.3, blur: 8 },
  medium: { opacity: 0.5, blur: 12 },
  bright: { opacity: 0.8, blur: 16 },
}

/**
 * KST 시간 가져오기 (UTC+9)
 */
function getKSTTime(): Date {
  const now = new Date()
  const kstOffset = 9 * 60 // 분 단위
  const utc = now.getTime() + now.getTimezoneOffset() * 60000
  return new Date(utc + kstOffset * 60000)
}

/**
 * 시간대 호(Arc) SVG Path 생성
 * @param startHour 시작 시간 (0-23)
 * @param startMinute 시작 분 (0-59)
 * @param endHour 종료 시간 (0-23)
 * @param endMinute 종료 분 (0-59)
 * @param radius 호의 반지름
 * @param width 호의 너비
 */
function createArcPath(
  startHour: number,
  startMinute: number,
  endHour: number,
  endMinute: number,
  radius: number,
  width: number
): string {
  // 시간을 소수점으로 변환 (예: 13시 30분 → 13.5)
  const startDecimal = startHour + startMinute / 60
  const endDecimal = endHour + endMinute / 60

  // 24시간 기준 각도 계산 (12시 방향이 0도)
  const startAngle = (startDecimal / 24) * 360 - 90 // -90은 12시 방향 기준
  const endAngle = (endDecimal / 24) * 360 - 90

  // 자정 경계 처리 (예: 23시 30분 ~ 5시 15분)
  let actualEndAngle = endAngle
  if (endDecimal < startDecimal) {
    actualEndAngle = endAngle + 360
  }

  // 라디안 변환
  const startRad = (startAngle * Math.PI) / 180
  const endRad = (actualEndAngle * Math.PI) / 180

  // 외곽 호의 시작/끝 좌표
  const outerRadius = radius
  const innerRadius = radius - width

  const x1 = CLOCK_CENTER_X + outerRadius * Math.cos(startRad)
  const y1 = CLOCK_CENTER_Y + outerRadius * Math.sin(startRad)
  const x2 = CLOCK_CENTER_X + outerRadius * Math.cos(endRad)
  const y2 = CLOCK_CENTER_Y + outerRadius * Math.sin(endRad)
  const x3 = CLOCK_CENTER_X + innerRadius * Math.cos(endRad)
  const y3 = CLOCK_CENTER_Y + innerRadius * Math.sin(endRad)
  const x4 = CLOCK_CENTER_X + innerRadius * Math.cos(startRad)
  const y4 = CLOCK_CENTER_Y + innerRadius * Math.sin(startRad)

  // 큰 호 플래그 (180도 이상이면 1)
  const largeArcFlag = actualEndAngle - startAngle > 180 ? 1 : 0

  return `
    M ${x1},${y1}
    A ${outerRadius},${outerRadius} 0 ${largeArcFlag} 1 ${x2},${y2}
    L ${x3},${y3}
    A ${innerRadius},${innerRadius} 0 ${largeArcFlag} 0 ${x4},${y4}
    Z
  `
}

/**
 * 시간대 호(Arc) 컴포넌트
 */
function RoutineArc({ routine }: { routine: DailyRoutine }) {
  const color = COLOR_MAP[routine.color] || COLOR_MAP['neon-cyan']
  const intensity = INTENSITY_MAP[routine.intensity] || INTENSITY_MAP.medium

  const arcPath = createArcPath(
    routine.start_hour,
    routine.start_minute || 0,
    routine.end_hour,
    routine.end_minute || 0,
    ROUTINE_ARC_RADIUS,
    ROUTINE_ARC_WIDTH
  )

  const filterId = `glow-${routine.id}`

  return (
    <>
      {/* SVG 필터 정의 (글로우 효과) */}
      <defs>
        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={intensity.blur} result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 호(Arc) 렌더링 */}
      <path
        d={arcPath}
        fill={color}
        fillOpacity={intensity.opacity}
        filter={`url(#${filterId})`}
        className="transition-all duration-300"
      />
    </>
  )
}

/**
 * 시간 눈금 (0-23시)
 */
function TimeMarker({ hour }: { hour: number }) {
  const angle = (hour / 24) * 360 - 90 // -90은 12시 방향 기준
  const rad = (angle * Math.PI) / 180

  const x = CLOCK_CENTER_X + CLOCK_RADIUS * Math.cos(rad)
  const y = CLOCK_CENTER_Y + CLOCK_RADIUS * Math.sin(rad)

  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="middle"
      className="fill-neon-cyan-500 font-mono text-xs opacity-60"
      style={{
        textShadow: '0 0 4px var(--color-neon-cyan-500)',
      }}
    >
      {hour}
    </text>
  )
}

/**
 * 시침/분침 컴포넌트
 */
function ClockHand({
  type,
  angle,
}: {
  type: 'hour' | 'minute'
  angle: number
}) {
  const isHour = type === 'hour'
  const length = isHour ? HOUR_HAND_LENGTH : MINUTE_HAND_LENGTH
  const width = isHour ? HOUR_HAND_WIDTH : MINUTE_HAND_WIDTH
  const color = isHour ? COLOR_MAP['neon-cyan'] : COLOR_MAP['neon-magenta']

  // 12시 방향 기준 회전
  const rad = ((angle - 90) * Math.PI) / 180
  const x2 = CLOCK_CENTER_X + length * Math.cos(rad)
  const y2 = CLOCK_CENTER_Y + length * Math.sin(rad)

  return (
    <line
      x1={CLOCK_CENTER_X}
      y1={CLOCK_CENTER_Y}
      x2={x2}
      y2={y2}
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      style={{
        filter: `drop-shadow(0 0 8px ${color})`,
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    />
  )
}

/**
 * 시간 포맷 헬퍼 함수 (HH:MM)
 */
function formatTime(hour: number, minute: number = 0): string {
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
}

/**
 * 범례 (Legend) 컴포넌트
 */
function RoutineLegend({ routines }: { routines: DailyRoutine[] | undefined }) {
  if (!routines || routines.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {routines.map((routine) => {
        const color = COLOR_MAP[routine.color] || COLOR_MAP['neon-cyan']

        return (
          <div key={routine.id} className="flex items-center gap-2">
            {/* 색상 인디케이터 */}
            <div
              className="h-3 w-3 rounded-full"
              style={{
                backgroundColor: color,
                boxShadow: `0 0 8px ${color}`,
              }}
            />

            {/* 루틴 라벨 */}
            <span className="font-mono text-xs text-neon-cyan-300">
              {routine.label} ({formatTime(routine.start_hour, routine.start_minute || 0)} - {formatTime(routine.end_hour, routine.end_minute || 0)})
            </span>
          </div>
        )
      })}
    </div>
  )
}

/**
 * 메인 컴포넌트 - 24시간 아날로그 루틴 시계
 */
export function DailyRoutineClock() {
  const { data: routines, isLoading, error } = useDailyRoutine()
  const [time, setTime] = useState<Date>(getKSTTime())

  // 1초마다 시간 업데이트
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getKSTTime())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // 시침/분침 각도 계산
  const hours = time.getHours()
  const minutes = time.getMinutes()

  const hourAngle = (hours / 24) * 360 + (minutes / 60) * (360 / 24)
  const minuteAngle = (minutes / 60) * 360

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <div className="h-[280px] w-[280px] animate-pulse rounded-full bg-black-elevated lg:h-[400px] lg:w-[400px]">
          <div className="flex h-full items-center justify-center font-mono text-sm text-neon-cyan-500">
            Loading...
          </div>
        </div>
      </div>
    )
  }

  // 에러 상태
  if (error) {
    return (
      <div className="flex items-center justify-center">
        <div className="rounded-lg border border-neon-orange-500 bg-black-elevated p-6">
          <p className="font-mono text-sm text-neon-orange-500">
            Error loading routines: {error.message}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-8">
      {/* SVG 시계 */}
      <div className="relative">
        <svg
          viewBox="0 0 400 400"
          className="h-[280px] w-[280px] lg:h-[400px] lg:w-[400px]"
        >
          {/* 배경 원 (시계 테두리) */}
          <circle
            cx={CLOCK_CENTER_X}
            cy={CLOCK_CENTER_Y}
            r={CLOCK_RADIUS}
            fill="none"
            stroke={COLOR_MAP['neon-cyan']}
            strokeWidth="2"
            strokeOpacity="0.2"
          />

          {/* 시간대 호(Arc) - 루틴 시각화 */}
          {routines?.map((routine) => (
            <RoutineArc key={routine.id} routine={routine} />
          ))}

          {/* 시간 눈금 (0-23시) */}
          {Array.from({ length: 24 }).map((_, i) => (
            <TimeMarker key={i} hour={i} />
          ))}

          {/* 시침 */}
          <ClockHand type="hour" angle={hourAngle} />

          {/* 분침 */}
          <ClockHand type="minute" angle={minuteAngle} />

          {/* 중앙 원 배경 */}
          <circle
            cx={CLOCK_CENTER_X}
            cy={CLOCK_CENTER_Y}
            r="50"
            fill={COLOR_MAP['neon-cyan']}
            fillOpacity="0.1"
            stroke={COLOR_MAP['neon-cyan']}
            strokeWidth="2"
          />

          {/* 중앙 원 (시침/분침 고정점) */}
          <circle
            cx={CLOCK_CENTER_X}
            cy={CLOCK_CENTER_Y}
            r="8"
            fill={COLOR_MAP['neon-cyan']}
            style={{
              filter: `drop-shadow(0 0 6px ${COLOR_MAP['neon-cyan']})`,
            }}
          />
        </svg>
      </div>

      {/* 현재 시간 표시 (디지털) */}
      <div className="font-mono text-lg text-neon-cyan-400">
        {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')} KST
      </div>

      {/* 범례 (Legend) */}
      <RoutineLegend routines={routines} />
    </div>
  )
}
