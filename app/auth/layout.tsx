import Image from 'next/image'

export const dynamic = 'force-dynamic'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-950 p-6">
      {/* Logo */}
      <div className="mb-10">
        <Image
          src="/projectorthv2.svg"
          alt="Project Orthodox"
          width={200}
          height={260}
          className="h-auto w-40"
          priority
        />
      </div>
      {children}
    </div>
  )
}
