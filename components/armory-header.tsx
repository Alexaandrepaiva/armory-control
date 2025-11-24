import Image from "next/image"

import { Separator } from "@/components/ui/separator"

export function ArmoryHeader() {
  return (
    <header className="bg-green-900 text-gray-100">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-3 px-4 py-3 md:flex-nowrap md:justify-between">
        <div className="order-1 flex basis-1/3 justify-end md:order-1 md:basis-auto md:justify-start">
          <Image
            src="/Símbolo_Blog-removebg-preview.png"
            alt="Símbolo do 17 Blog Sl"
            width={56}
            height={56}
            priority
            className="h-16 w-auto"
          />
        </div>

        <div className="order-3 w-full text-center md:order-2 md:w-auto">
          <h1 className="text-xl font-semibold tracking-tight">17 BLog Sl</h1>
          <p className="text-sm text-gray-100/80">
            Controle da reserva se armamento
          </p>
        </div>

        <div className="order-2 flex basis-1/3 justify-start md:order-3 md:basis-auto md:justify-end">
          <Image
            src="/IME.png"
            alt="Insígnia do IME"
            width={56}
            height={56}
            priority
            className="h-16 w-auto"
          />
        </div>
      </div>

      <Separator className="bg-gray-500/60" />
    </header>
  )
}


