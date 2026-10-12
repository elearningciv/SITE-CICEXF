import { doc, setDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase';

export async function markItemDeleted(type: 'formations' | 'accompagnements' | 'realisations' | 'blog_posts', id: string) {
  try {
    const fieldMap = {
      formations: 'deletedFormationIds',
      accompagnements: 'deletedAccompagnementIds',
      realisations: 'deletedRealisationIds',
      blog_posts: 'deletedBlogPostIds'
    };
    const field = fieldMap[type];
    await setDoc(doc(db, 'app_settings', 'deleted_items'), {
      [field]: arrayUnion(id)
    }, { merge: true });
  } catch (err) {
    console.error(`Error marking ${type} deleted:`, err);
  }
}

export async function markItemRestored(type: 'formations' | 'accompagnements' | 'realisations' | 'blog_posts', id: string) {
  try {
    const fieldMap = {
      formations: 'deletedFormationIds',
      accompagnements: 'deletedAccompagnementIds',
      realisations: 'deletedRealisationIds',
      blog_posts: 'deletedBlogPostIds'
    };
    const field = fieldMap[type];
    await setDoc(doc(db, 'app_settings', 'deleted_items'), {
      [field]: arrayRemove(id)
    }, { merge: true });
  } catch (err) {
    console.error(`Error restoring ${type}:`, err);
  }
}
