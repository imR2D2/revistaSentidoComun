import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection, getDocs, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { imgDB, txtDB } from '@utils/firebase/firebase.config';
import { v4 as uuidv4 } from 'uuid';
import { query, where, orderBy } from 'firebase/firestore';

// Función para subir datos a Firebase
export const uploadDataToFirebase = async (File, FilePdf, FullName, ShortDescription, Location, Year, Month, Day, Link, Responsibility, Title, TitleURL, Content, DateValue, EducationHistory) => {
    const imgs = ref(imgDB, `Imgs/${uuidv4()}`);
    const pdfs = ref(imgDB, `Pdfs/${uuidv4()}`);

    try {
        // Subir imagen a Firebase Storage
        const snapshot = await uploadBytes(imgs, File);
        const downloadURL = await getDownloadURL(snapshot.ref);

        // Subir PDF a Firebase Storage
        const snapshotPdf = await uploadBytes(pdfs, FilePdf);
        const downloadURLPdf = await getDownloadURL(snapshotPdf.ref);

        // console.log({"downloadURL": downloadURL}, {"FullName": FullName}, {"ShortDescription": ShortDescription}, {"Location": Location}, {"Year": Year}, {"Month": Month}, {"Day": Day}, {"Link": Link}, {"Responsibility": Responsibility}, {"Title": Title}, {"TitleURL": TitleURL}, {"Content": Content}, {"DateValue": DateValue}, {"EducationHistory": EducationHistory});

        if (downloadURL && downloadURLPdf) {
            const valRef = collection(txtDB, 'c27_blog');
            await addDoc(valRef, {
                imageFile: downloadURL,
                pdfFile: downloadURLPdf,
                title: Title,
                titleURL: TitleURL,
                shortDescription: ShortDescription,
                fullName: FullName,
                location: Location,
                day: Day,
                month: Month,
                year: Year,
                link: Link,
                idResponsabilidad: Responsibility,
                content: Content,
                date: DateValue,
                educationHistory: EducationHistory
            });
            return { success: true, message: 'Data added successfully' };
        }
    } catch (error) {
        return { success: false, message: error.message };
    }
};

// Función para obtener todos los datos
export const getData = async (year, month) => {
    try {
        const valRef = collection(txtDB, 'c27_blog');

        // Filtramos por el año y mes si se pasan como parámetros
        let q = query(valRef, orderBy("date", "desc"));
        
        if (year) {
            q = query(q, where("year", "==", year));
        }

        if (month) {
            q = query(q, where("month", "==", month));
        }

        const dataDB = await getDocs(q);

        const allData = dataDB.docs.map(val => ({ ...val.data(), id: val.id }));
        return { success: true, data: allData };
    } catch (error) {
        return { success: false, message: error.message };
    }
};


// Función para obtener datos por ID
export const getDataById = async (id) => {
    try {
        const docRef = doc(txtDB, 'c27_blog', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const singleData = { ...docSnap.data(), id: docSnap.id };
            return { success: true, data: singleData };
        } else {
            return { success: false, message: 'No such document!' };
        }
    } catch (error) {
        return { success: false, message: error.message };
    }
};

// Función para actualizar datos en Firebase
export const updateDataInFirebase = async (
    id,
    File,
    FullName,
    ShortDescription,
    Location,
    Year,
    Month,
    Day,
    Link,
    Responsibility,
    Title,
    TitleURL,
    Content,
    DateValue,
    EducationHistory
) => {
    const docRef = doc(txtDB, 'c27_blog', id);

    try {
        // Obtener el documento actual
        const existingDoc = await getDoc(docRef);

        if (!existingDoc.exists()) {
            return { success: false, message: 'Document not found' };
        }

        const downloadURL = existingDoc.data().imageFile; // URL de la imagen actual
        let updatedData = {
            title: Title,
            titleURL: TitleURL,
            shortDescription: ShortDescription,
            fullName: FullName,
            location: Location,
            day: Day,
            month: Month,
            year: Year,
            link: Link,
            idResponsabilidad: Responsibility,
            content: Content,
            date: DateValue,
            educationHistory: EducationHistory,
        };

        // Verificar si hay un nuevo archivo
        if (File !== downloadURL) {
            const fileName = uuidv4(); // Generar un nuevo nombre de archivo
            const imgs = ref(imgDB, `Imgs/${fileName}`);
            const snapshot = await uploadBytes(imgs, File); // Subir el nuevo archivo
            const newDownloadURL = await getDownloadURL(snapshot.ref); // Obtener la nueva URL

            updatedData = { ...updatedData, imageFile: newDownloadURL };
        }

        // Actualizar el documento
        await updateDoc(docRef, updatedData);

        return { success: true, message: 'Data updated successfully' };

    } catch (error) {
        return { success: false, message: error.message };
    }
};


// Función para eliminar un documento por ID en Firebase
export const deleteDataInFirebase = async (id) => {
    try {
        const docRef = doc(txtDB, 'c27_blog', id);
        await deleteDoc(docRef);
        return { success: true, message: 'Data deleted successfully' };
    } catch (error) {
        return { success: false, message: `Error deleting document: ${error.message}` };
    }
};

export const getDataByTitleAndId = async (titleURL, id) => {
    try {
        if (titleURL) {
            const valRef = collection(txtDB, 'c27_blog');
            const q = query(valRef, where('titleURL', '==', titleURL));
            const dataDB = await getDocs(q);
            if (!dataDB.empty) {
                const allData = dataDB.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
                return { success: true, data: allData };
            } else {
                return { success: false, message: 'No documents found with that title.' };
            }
        } else if (id, titleURL) {
            const valRef = collection(txtDB, 'c27_blog');
            const q = query(valRef, where('titleURL', '==', titleURL));
            const dataDB = await getDocs(q);
            if (!dataDB.empty) {
                const allData = dataDB.docs.map((doc) => ({ ...doc.data(), id: doc.id })).filter((doc) => doc.id === id);
                return { success: true, data: allData };
            } else {
                return { success: false, message: 'No documents found with that title.' };
            }
        }
    } catch (error) {
        return { success: false, message: error.message };
    }
};