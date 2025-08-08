import { Alert, Platform } from 'react-native';
// Import necessary libraries
import * as XLSX from 'xlsx';
import RNFS from 'react-native-fs';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

// --- MAIN EXPORT FUNCTION ---
export const exportExcelAndShare = async (jsonData) => {
  // 1. Request storage permissions (key for Android)
  try {
    console.log('Requesting storage permissions for Android version:', Platform.Version);
    const permission =
      Platform.Version >= 33
        ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES // On Android 13+, there isn't a general "documents" permission for writing. RNFS uses MediaStore, which often doesn't need a specific permission for saving new files. This permission is a good fallback.
        : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;

    const status = await check(permission);
    if (status !== RESULTS.GRANTED) {
      const result = await request(permission);
      if (result !== RESULTS.GRANTED) {
        Alert.alert(
          'Permission Denied',
          'Cannot save the file without storage permissions.',
        );
        return;
      }
    }

    // 2. Create the worksheet from the JSON data
    const worksheet = XLSX.utils.json_to_sheet(jsonData);

    // 3. Create a new workbook
    const workbook = XLSX.utils.book_new();

    // 4. Append the worksheet to the workbook with a name
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Expenses');

    // 5. Generate the Excel file content in base64 format
    const base64Data = XLSX.write(workbook, {
      type: 'base64',
      bookType: 'xlsx',
    });

    // 6. Define the save path using RNFS and MediaStore
    const fileName = `ExpensesReport_${new Date().getTime()}.xlsx`;
    
    // The public Documents folder is `RNFS.ExternalStorageDirectoryPath + '/Documents'`.
    // On modern Android, RNFS handles writing to these public directories via MediaStore.
    const documentsPath = `${RNFS.ExternalStorageDirectoryPath}/Documents/${fileName}`;

    // 7. Write the file to the system
    await RNFS.writeFile(documentsPath, base64Data, 'base64');

    Alert.alert(
      'Success',
      `The Excel file has been saved successfully at: ${documentsPath}`,
    );
  } catch (error) {
    console.error('Error generating or saving the file:', error);
    Alert.alert('Error', 'There was a problem saving the Excel file.');
  }
};
