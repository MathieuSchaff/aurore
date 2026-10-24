import { ImageUpload } from '@/component/ImageUpload/ImageUpload'
import { FormField } from '@/component/Input/FormField/FormField'
import { Input } from '@/component/Input/Input'

type CreateProps = {
  mode: 'create'
  endpoint: string | null
  imageUrl: string
  onUpload: (url: string) => void
}

type EditProps = {
  mode: 'edit'
  productSlug: string
  productName: string
  imageUrl: string
  altName: string
  onUpload: (url: string) => void
}

type Props = (CreateProps | EditProps) & { onBusyChange?: (busy: boolean) => void }

const UPLOAD_SETTINGS = {
  successMessage: 'Image préparée. Enregistrez la fiche pour la conserver.',
  shape: 'square',
  outputSize: 1200,
  notFoundLabel: 'Produit',
} as const

export function ProductImageField(props: Props) {
  if (props.mode === 'create') {
    if (!props.endpoint) {
      return (
        <FormField label="Image du produit">
          <p className="product-form__upload-hint">
            Entrez un nom et une marque pour ajouter une image.
          </p>
        </FormField>
      )
    }
    return (
      <FormField label="Image du produit">
        <ImageUpload
          {...UPLOAD_SETTINGS}
          onBusyChange={props.onBusyChange}
          endpoint={props.endpoint}
          currentImageUrl={props.imageUrl}
          alt="Image du produit"
          onSuccess={props.onUpload}
        />
      </FormField>
    )
  }

  return (
    <FormField label="Image du produit">
      <ImageUpload
        {...UPLOAD_SETTINGS}
        onBusyChange={props.onBusyChange}
        endpoint={`/api/uploads/product/${props.productSlug}?draft=true`}
        currentImageUrl={props.imageUrl}
        alt={`Image de ${props.altName}`}
        onSuccess={props.onUpload}
      />
      {props.imageUrl && (
        <Input
          id="edit-image-url"
          value={props.imageUrl}
          readOnly
          onFocus={(e) => e.currentTarget.select()}
          aria-label="URL de l'image (lecture seule)"
          hideRequired
        />
      )}
    </FormField>
  )
}
