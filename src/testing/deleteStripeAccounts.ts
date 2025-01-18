import { stripeService } from "src/services/stripe.service"

const main = async () => {
  try {
    stripeService.deleteAccounts()
  } catch (error) {
    console.error(error)
  }
}

main()