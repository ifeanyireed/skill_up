// ============================================================================
// NETS Enterprise Lead Management — Email Service (Mock)
// ============================================================================
// Simulates API integration with an email provider (e.g. SendGrid, Postmark).
// ============================================================================

class EmailService {
  /**
   * Send a branded confirmation email to the customer.
   * Does not expose internal pricing formulas, only the safe Estimated Investment.
   */
  public async sendConfirmationEmail(payload: any): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const customerEmail = payload.customerInformation?.email

        console.log('✉️ [EMAIL SERVICE] Customer Confirmation Sent')
        console.log(`    To: ${customerEmail}`)
        console.log(`    Subject: Your Journey Quotation Request - ${payload.leadMetadata?.quoteReferenceNumber}`)
        console.log(`    Body: "Thank you ${payload.customerInformation?.name}. We have received your request..."`)
        
        resolve(true)
      }, 500)
    })
  }

  /**
   * Send an immediate internal notification to the Sales Team.
   */
  public async sendInternalNotification(payload: any): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const estimatedMax = payload.estimatedInvestment?.maximumEstimate || 'N/A'
        
        console.log('🔔 [EMAIL SERVICE] Internal Sales Notification Sent')
        console.log(`    To: sales@netsnigeria.com`)
        console.log(`    Subject: [NEW LEAD] ${payload.customerInformation?.name} - ${payload.leadMetadata?.quoteReferenceNumber}`)
        console.log(`    Highlights: ${payload.journeyInformation?.journeyType}, Est: ${estimatedMax}`)
        
        resolve(true)
      }, 600)
    })
  }
}

export const emailService = new EmailService()
