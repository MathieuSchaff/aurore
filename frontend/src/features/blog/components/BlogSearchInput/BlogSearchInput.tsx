import { Search } from 'lucide-react'

import { Input } from '@/component/Input/Input'

type Props = {
  value: string
  placeholder: string
  onChange: (value: string) => void
}

export function BlogSearchInput({ value, placeholder, onChange }: Props) {
  return (
    <div className="blog-search-wrap">
      <Search size={15} className="blog-search__icon" aria-hidden />
      <Input
        type="search"
        name="q"
        className="blog-search__input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        aria-label="Rechercher"
      />
    </div>
  )
}
