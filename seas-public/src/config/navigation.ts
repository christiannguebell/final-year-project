export const SUPPORT_EMAIL = 'support@seas.cm';
export const ADMISSIONS_EMAIL = 'admissions@seas.cm';

export const FOOTER_LINKS = [
  { label: 'Institutional Privacy', href: `mailto:${SUPPORT_EMAIL}?subject=Institutional%20Privacy` },
  { label: 'Accessibility', href: `mailto:${SUPPORT_EMAIL}?subject=Accessibility` },
  { label: 'Technical Standards', href: `mailto:${SUPPORT_EMAIL}?subject=Technical%20Standards` },
  { label: 'Contact SEAS', href: `mailto:${ADMISSIONS_EMAIL}` },
] as const;

export const LANDING_SECTIONS = {
  admissions: 'admissions',
  programs: 'programs',
  resources: 'resources',
  help: 'help',
} as const;

export function scrollToSection(sectionId: string) {
  const el = document.getElementById(sectionId);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return true;
  }
  return false;
}

export function openSupportEmail(subject = 'SEAS Portal Support') {
  window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}`;
}

export function openAdmissionsEmail(subject = 'Admissions Inquiry') {
  window.location.href = `mailto:${ADMISSIONS_EMAIL}?subject=${encodeURIComponent(subject)}`;
}

export function printCurrentPage() {
  window.print();
}

export function downloadPlaceholder(documentName: string) {
  // Placeholder until backend PDF endpoints are wired in the portal
  const content = `${documentName}\n\nGenerated from SEAS Candidate Portal.\nThis is a preview document.`;
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${documentName.toLowerCase().replace(/\s+/g, '-')}.txt`;
  link.click();
  URL.revokeObjectURL(url);
}
