import { CertificationFormData } from '../schemas'

export function toCertificationPayload(data: CertificationFormData) {
  return {
    title: data.title,
    issuer: data.issuer,
    issuedAt: data.issuedAt || undefined,
    expiresAt: data.expiresAt || undefined,
    credentialUrl: data.credentialUrl || undefined,
  }
}
