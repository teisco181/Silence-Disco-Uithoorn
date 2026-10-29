import {
  collection,
  doc,
  setDoc,
  addDoc,
  getDoc,
  getDocs,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { db, auth, googleProvider, ADMIN_EMAIL, handleFirestoreError, OperationType } from './config';
export { auth };
import { ChatMessage, Conversation, UserProfile, CustomProduct, BookingRecord } from '../types/rental';

// Check if user is admin
export function isUserAdmin(user: User | null): boolean {
  if (!user) return false;
  return user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

// Sign in with Google
export async function loginWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    await syncUserProfile(user);
    return user;
  } catch (error) {
    console.warn('Google sign in error:', error);
    throw error;
  }
}

// Log out
export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

// Sync user profile to Firestore
export async function syncUserProfile(user: User, customRole?: 'customer' | 'admin'): Promise<UserProfile> {
  const role = isUserAdmin(user) || customRole === 'admin' ? 'admin' : 'customer';
  const profile: UserProfile = {
    uid: user.uid,
    email: user.email || '',
    displayName: user.displayName || user.email?.split('@')[0] || 'Klant',
    role,
    createdAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, 'users', user.uid), profile, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
  }
  return profile;
}

// Listen to messages for a conversation
export function subscribeToMessages(
  conversationId: string,
  onMessages: (messages: ChatMessage[]) => void
) {
  const messagesRef = collection(db, 'conversations', conversationId, 'messages');
  const q = query(messagesRef, orderBy('createdAt', 'asc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const msgs: ChatMessage[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        msgs.push({
          id: d.id,
          conversationId,
          senderId: data.senderId,
          senderName: data.senderName,
          senderEmail: data.senderEmail,
          senderRole: data.senderRole,
          text: data.text,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt || new Date().toISOString(),
          isRead: !!data.isRead,
        });
      });
      onMessages(msgs);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, `conversations/${conversationId}/messages`);
    }
  );
}

// Listen to all conversations (for Admin)
export function subscribeToAdminConversations(
  onConversations: (conversations: Conversation[]) => void
) {
  const convsRef = collection(db, 'conversations');
  const q = query(convsRef, orderBy('updatedAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const convs: Conversation[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        convs.push({
          id: d.id,
          customerId: data.customerId,
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          lastMessage: data.lastMessage,
          lastSenderRole: data.lastSenderRole,
          lastMessageAt: data.lastMessageAt || '',
          unreadByAdmin: data.unreadByAdmin || 0,
          unreadByCustomer: data.unreadByCustomer || 0,
          updatedAt: data.updatedAt || '',
        });
      });
      onConversations(convs);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, 'conversations');
    }
  );
}

// Send a chat message
export async function sendChatMessage(params: {
  conversationId: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  senderRole: 'customer' | 'admin';
  text: string;
  customerName?: string;
  customerEmail?: string;
}) {
  const { conversationId, senderId, senderName, senderEmail, senderRole, text } = params;
  const nowIso = new Date().toISOString();

  // 1. Ensure conversation exists / updated
  const convRef = doc(db, 'conversations', conversationId);
  try {
    const convSnap = await getDoc(convRef);
    if (!convSnap.exists()) {
      await setDoc(convRef, {
        id: conversationId,
        customerId: senderRole === 'customer' ? senderId : conversationId.replace('customer_', ''),
        customerName: params.customerName || senderName,
        customerEmail: params.customerEmail || senderEmail,
        lastMessage: text,
        lastSenderRole: senderRole,
        lastMessageAt: nowIso,
        unreadByAdmin: senderRole === 'customer' ? 1 : 0,
        unreadByCustomer: senderRole === 'admin' ? 1 : 0,
        createdAt: nowIso,
        updatedAt: nowIso,
      });
    } else {
      const current = convSnap.data();
      await updateDoc(convRef, {
        lastMessage: text,
        lastSenderRole: senderRole,
        lastMessageAt: nowIso,
        unreadByAdmin: senderRole === 'customer' ? (current.unreadByAdmin || 0) + 1 : 0,
        unreadByCustomer: senderRole === 'admin' ? (current.unreadByCustomer || 0) + 1 : current.unreadByCustomer || 0,
        updatedAt: nowIso,
      });
    }

    // 2. Add message to subcollection
    const messagesRef = collection(db, 'conversations', conversationId, 'messages');
    await addDoc(messagesRef, {
      conversationId,
      senderId,
      senderName,
      senderEmail,
      senderRole,
      text,
      createdAt: serverTimestamp(),
      isRead: false,
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `conversations/${conversationId}/messages`);
    throw err;
  }
}

// Mark conversation as read
export async function markConversationAsRead(conversationId: string, byRole: 'admin' | 'customer') {
  try {
    const convRef = doc(db, 'conversations', conversationId);
    if (byRole === 'admin') {
      await updateDoc(convRef, { unreadByAdmin: 0 });
    } else {
      await updateDoc(convRef, { unreadByCustomer: 0 });
    }
  } catch (err) {
    // Non-blocking
  }
}

// Custom Products sync with Firestore
export function subscribeToCustomProducts(onProducts: (products: CustomProduct[]) => void) {
  const prodRef = collection(db, 'products');
  return onSnapshot(
    prodRef,
    (snapshot) => {
      const prods: CustomProduct[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        prods.push({
          id: d.id,
          name: data.name,
          description: data.description || '',
          price: Number(data.price) || 0,
          stock: Number(data.stock) || 0,
          active: data.active !== false,
          createdAt: data.createdAt,
        });
      });
      onProducts(prods);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, 'products');
    }
  );
}

export async function saveCustomProduct(product: CustomProduct) {
  try {
    const prodDoc = doc(db, 'products', product.id);
    await setDoc(prodDoc, product, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `products/${product.id}`);
    throw err;
  }
}

export async function deleteCustomProduct(productId: string) {
  try {
    await deleteDoc(doc(db, 'products', productId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `products/${productId}`);
    throw err;
  }
}

// Bookings Firestore sync
export async function saveBookingToFirestore(booking: BookingRecord) {
  try {
    await setDoc(doc(db, 'bookings', booking.id), booking);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `bookings/${booking.id}`);
  }
}
