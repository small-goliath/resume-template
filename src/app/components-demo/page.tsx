'use client'

import { Sparkles, Code2, Zap, Rocket, Heart } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SectionCard } from '@/components/section-card'

// 컴포넌트 데모 페이지 - 커스터마이징된 Button, Card, SectionCard 시연
export default function ComponentsDemoPage() {
  return (
    <div className="container mx-auto max-w-6xl space-y-12 px-4 py-12">
      {/* 페이지 헤더 */}
      <header className="space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          커스텀 컴포넌트 데모
        </h1>
        <p className="text-muted-foreground text-lg">
          현대적이고 개발자스러운 디자인 시스템
        </p>
      </header>

      {/* Button Variants 데모 */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold">Button Variants</h2>

        {/* 기본 variants */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>기본 Variants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button variant="default">Default</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
          </CardContent>
        </Card>

        {/* 새로운 커스텀 variants */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>커스텀 Variants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button variant="gradient" size="lg">
                <Sparkles className="mr-2 size-4" />
                Gradient
              </Button>
              <Button variant="glass" size="lg">
                <Code2 className="mr-2 size-4" />
                Glass
              </Button>
              <Button variant="neon" size="lg">
                <Zap className="mr-2 size-4" />
                Neon
              </Button>
              <Button variant="sleek" size="lg">
                <Rocket className="mr-2 size-4" />
                Sleek
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 버튼 사이즈 */}
        <Card variant="outline">
          <CardHeader>
            <CardTitle>Button Sizes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="gradient" size="xs">
                Extra Small
              </Button>
              <Button variant="gradient" size="sm">
                Small
              </Button>
              <Button variant="gradient" size="default">
                Default
              </Button>
              <Button variant="gradient" size="lg">
                Large
              </Button>
              <Button variant="gradient" size="xl">
                Extra Large
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Card Variants 데모 */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold">Card Variants</h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card variant="default">
            <CardHeader>
              <CardTitle>Default Card</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                기본 카드 스타일입니다.
              </p>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Elevated Card</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                입체감 있는 그라디언트 카드입니다.
              </p>
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardHeader>
              <CardTitle>Glass Card</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Glassmorphism 효과의 카드입니다.
              </p>
            </CardContent>
          </Card>

          <Card variant="outline">
            <CardHeader>
              <CardTitle>Outline Card</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                아웃라인 강조 카드입니다.
              </p>
            </CardContent>
          </Card>

          <Card variant="minimal">
            <CardHeader>
              <CardTitle>Minimal Card</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                미니멀 디자인 카드입니다.
              </p>
            </CardContent>
          </Card>

          <Card variant="neon">
            <CardHeader>
              <CardTitle>Neon Card</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                네온 효과의 개발자스러운 카드입니다.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* SectionCard 데모 */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold">SectionCard 컴포넌트</h2>

        {/* 기본 SectionCard */}
        <SectionCard
          icon={Code2}
          title="개발 경험"
          description="프론트엔드 및 백엔드 개발 경력"
          variant="elevated"
        >
          <div className="space-y-4">
            <SectionCard.Item
              icon={Rocket}
              title="Senior Frontend Developer"
              subtitle="Tech Company Inc."
              period="2022 - Present"
              description="Next.js, React, TypeScript를 활용한 대규모 웹 애플리케이션 개발"
            />
            <SectionCard.Item
              icon={Heart}
              title="Frontend Developer"
              subtitle="Startup Co."
              period="2020 - 2022"
              description="Vue.js 기반 SaaS 플랫폼 개발 및 유지보수"
            />
          </div>
        </SectionCard>

        {/* Glass variant SectionCard */}
        <SectionCard
          icon={Sparkles}
          title="주요 프로젝트"
          description="개인 및 팀 프로젝트 포트폴리오"
          variant="glass"
          iconColor="text-purple-500"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Card variant="interactive">
              <CardHeader>
                <CardTitle>프로젝트 A</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Next.js 16 + FastAPI로 구축한 개발자 포트폴리오 시스템
                </p>
              </CardContent>
            </Card>

            <Card variant="interactive">
              <CardHeader>
                <CardTitle>프로젝트 B</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  React 19 + TailwindCSS v4 기반 디자인 시스템
                </p>
              </CardContent>
            </Card>
          </div>
        </SectionCard>

        {/* Neon variant SectionCard */}
        <SectionCard
          icon={Zap}
          title="기술 스택"
          description="주로 사용하는 기술과 도구"
          variant="neon"
          iconColor="text-cyan-500"
          iconBackground={false}
        >
          <div className="flex flex-wrap gap-2">
            {[
              'TypeScript',
              'React',
              'Next.js',
              'TailwindCSS',
              'FastAPI',
              'PostgreSQL',
            ].map(tech => (
              <span
                key={tech}
                className="rounded-full border border-cyan-500/50 bg-cyan-500/10 px-3 py-1 text-sm font-medium text-cyan-600 dark:text-cyan-400"
              >
                {tech}
              </span>
            ))}
          </div>
        </SectionCard>
      </section>

      {/* 조합 예제 */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold">조합 예제</h2>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle>인터랙티브 섹션</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                다양한 버튼과 카드를 조합하여 풍부한 UI를 구성할 수 있습니다.
              </p>

              <div className="flex flex-wrap gap-3">
                <Button variant="gradient" onClick={() => {}}>
                  {/* TODO: 클릭 이벤트 구현 */}
                  <Sparkles className="mr-2" />
                  시작하기
                </Button>
                <Button variant="neon" onClick={() => {}}>
                  {/* TODO: 클릭 이벤트 구현 */}
                  <Code2 className="mr-2" />
                  코드 보기
                </Button>
                <Button variant="glass" onClick={() => {}}>
                  {/* TODO: 클릭 이벤트 구현 */}
                  <Rocket className="mr-2" />
                  배포하기
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
