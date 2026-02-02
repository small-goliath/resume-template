export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">대시보드</h2>
        <p className="mt-2 text-gray-600">
          포트폴리오 데이터를 관리하는 페이지입니다.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="font-semibold">프로필</h3>
          <p className="mt-2 text-sm text-gray-600">프로필 정보 관리</p>
        </div>
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="font-semibold">타임라인</h3>
          <p className="mt-2 text-sm text-gray-600">경력 타임라인 관리</p>
        </div>
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="font-semibold">섹션 설정</h3>
          <p className="mt-2 text-sm text-gray-600">섹션 표시 제어</p>
        </div>
      </div>
    </div>
  )
}
