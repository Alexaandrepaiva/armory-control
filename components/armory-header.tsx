export function ArmoryHeader() {
  return (
    <header className="flex h-20 items-center justify-between border-b border-gray-500 bg-green-900 px-8 text-gray-100">
      <div>
        <h1 className="text-lg font-semibold">Controle de Armaria</h1>
        <p className="text-sm text-gray-100">
          Sistema de registro de empréstimos de itens da unidade militar
        </p>
      </div>
      <div className="text-right text-xs text-gray-100">
        <p>Uso interno</p>
        <p>Responsável: Seção de Armamento</p>
      </div>
    </header>
  )
}


