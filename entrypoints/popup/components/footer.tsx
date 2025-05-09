import { name, version } from '@/package.json'

function Footer() {
  return (
    <footer className="text-muted-foreground bg-card flex items-center justify-between p-4 py-2 font-mono text-xs">
      <p>{name}</p>
      <p>{version}</p>
    </footer>
  )
}

export { Footer }
