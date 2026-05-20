const NAV_OFFSET = 88

export function scrollToSection(href: string) {
  const id = href.replace("#", "")
  const element = document.getElementById(id)
  if (!element) return

  const top =
    element.getBoundingClientRect().top + window.scrollY - NAV_OFFSET
  window.scrollTo({ top, behavior: "smooth" })
}
