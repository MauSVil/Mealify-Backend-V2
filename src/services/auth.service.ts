import { AdminRepository } from "../repositories/Admin.repository";
import { DeliveryDriverRepository } from "../repositories/DeliveryDriver.repository";
import { UserRepository } from "../repositories/User.repository";
import { Admin, adminSchema } from "../types/Admin.type";
import { DeliveryDriver, deliveryDriverSchema } from "../types/DeliveryDriver.type";
import { User, userSchema } from "../types/User.type";
import { stripeService } from "./stripe.service";

export const authService = {
  register: async (data: User | Admin | DeliveryDriver , role: 'user' | 'admin' | 'deliveryDriver') => {
    switch (role) {
      case 'user':
        const userData = await userSchema.parseAsync(data);
        return await UserRepository.createOne(userData);
      case 'admin':
        const adminData = await adminSchema.parseAsync(data);
        const customer = await stripeService.createCustomer({ email: adminData.email, metadata: { role: 'admin' } });
        return await AdminRepository.createOne(
          {
            ...adminData,
            customer_id: customer.id
          }
        );
      case 'deliveryDriver':
        const deliveryDriverData = await deliveryDriverSchema.parseAsync(data);
        return await DeliveryDriverRepository.createOne(deliveryDriverData);
      default:
        throw new Error('Invalid role');
    }
  }
};