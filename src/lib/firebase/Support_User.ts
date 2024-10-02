import { doc, setDoc } from 'firebase/firestore';
import { db } from './app'; // Your Firebase configuration

export async function savePurchaseDetails(details: {
  cardNumber: string;
  expirationDate: string;
  cvv: string;
  orderId: string;
  amount: string;
  purchaseDate: string;
}) {
  const purchaseRef = doc(db, 'purchases', details.orderId);
  await setDoc(purchaseRef, {
    cardNumber: details.cardNumber,
    expirationDate: details.expirationDate,
    cvv: details.cvv,
    amount: details.amount,
    purchaseDate: details.purchaseDate,
  });
}
