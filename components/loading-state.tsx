import Image from "next/image"

export function LoadingState() {
  return (
    <div className="flex min-h-[260px] items-center justify-center rounded-lg border border-gray-500/70 bg-gray-100/70 shadow-sm">
      <div className="flex flex-col items-center gap-3">
        <Image
          src="https://p345cdotr9.ufs.sh/f/BNJxUdRM2uoi7koElMwSW0GbzOH531AUfQ64TlcIa2XNPj9Y"
          alt="Símbolo do 17 BLog Sl"
          width={72}
          height={72}
          className="h-20 w-auto blog-loading-zoom"
          priority
        />

        <div className="flex flex-col items-center gap-1">
          <span className="text-base font-semibold tracking-tight text-green-900">
            17 BLog Sl
          </span>
          <span className="text-sm text-gray-600">
            Carregando...
          </span>
        </div>
      </div>
    </div>
  )
}


