// Each component renders pure CSS shapes — no images, no SVG, no icons.
// Animations are driven entirely by CSS classes defined in HomePage.css.

export function ObjJar() {
  return (
    <div className="obj-jar">
      <div className="obj-jar__lid" />
      <div className="obj-jar__base" />
    </div>
  )
}

export function ObjDropper() {
  return (
    <div className="obj-dropper">
      <div className="obj-dropper__bulb" />
      <div className="obj-dropper__neck" />
      <div className="obj-dropper__tube">
        <div className="obj-dropper__drop" />
      </div>
    </div>
  )
}

export function ObjSpray() {
  return (
    <div className="obj-spray">
      <div className="obj-spray__head" />
      <div className="obj-spray__pump" />
      <div className="obj-spray__body" />
    </div>
  )
}

export function ObjPerfume() {
  return (
    <div className="obj-perfume">
      <div className="obj-perfume__atomizer" />
      <div className="obj-perfume__collar" />
      <div className="obj-perfume__bottle" />
    </div>
  )
}

export function ObjTarget() {
  return (
    <div className="obj-target">
      <div className="obj-target__ring obj-target__ring--1" />
      <div className="obj-target__ring obj-target__ring--2" />
      <div className="obj-target__ring obj-target__ring--3" />
      <div className="obj-target__dot" />
    </div>
  )
}

export function ObjVial() {
  return (
    <div className="obj-vial">
      <div className="obj-vial__cap" />
      <div className="obj-vial__glass" />
    </div>
  )
}
