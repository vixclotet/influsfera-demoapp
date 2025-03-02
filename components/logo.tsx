import Image from "next/image"
import Link from "next/link"

export function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <div className="relative h-10 w-10">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/influsfera-logo-4azdYCbU8FbwYKi7cB3bP66pvt5cHc.png"
          alt="Influsfera Logo"
          width={40}
          height={40}
          className="h-10 w-10 object-contain"
        />
      </div>
      <span className="font-bold text-xl">Influsfera</span>
    </Link>
  )
}

