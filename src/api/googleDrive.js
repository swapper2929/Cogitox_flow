// Google Drive API operations (client-side only)
// Uses Google Drive API with OAuth token

export const createProjectFolder = async (projectName, userId) => {
  if (!window.gapi?.client?.drive) {
    throw new Error('Google Drive API not initialized');
  }
  
  try {
    // Create folder structure: CogitoxFlow/UserID/ProjectName/
    const response = await window.gapi.client.drive.files.create({
      resource: {
        name: projectName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: ['appDataFolder'], // Use app data folder for better isolation
      },
      fields: 'id, name, webViewLink',
    });
    
    return {
      id: response.result.id,
      name: response.result.name,
      webLink: response.result.webViewLink,
    };
  } catch (error) {
    console.error('Error creating folder:', error);
    throw error;
  }
};

export const uploadProjectFile = async (projectId, filename, content) => {
  if (!window.gapi?.client?.drive) {
    throw new Error('Google Drive API not initialized');
  }
  
  try {
    const blob = new Blob([JSON.stringify(content)], { type: 'application/json' });
    
    const response = await window.gapi.client.drive.files.create({
      resource: {
        name: filename,
        parents: [projectId],
      },
      media: {
        mimeType: 'application/json',
        body: blob,
      },
      fields: 'id, name, webViewLink, modifiedTime',
    });
    
    return {
      id: response.result.id,
      name: response.result.name,
      modifiedTime: response.result.modifiedTime,
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

export const downloadProjectFile = async (fileId) => {
  if (!window.gapi?.client?.drive) {
    throw new Error('Google Drive API not initialized');
  }
  
  try {
    const response = await window.gapi.client.drive.files.get({
      fileId: fileId,
      alt: 'media',
    });
    
    return response.result;
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
};

export const listProjectFiles = async (folderId) => {
  if (!window.gapi?.client?.drive) {
    throw new Error('Google Drive API not initialized');
  }
  
  try {
    const response = await window.gapi.client.drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      spaces: 'drive',
      fields: 'files(id, name, modifiedTime, mimeType)',
    });
    
    return response.result.files || [];
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
};

export const deleteProjectFile = async (fileId) => {
  if (!window.gapi?.client?.drive) {
    throw new Error('Google Drive API not initialized');
  }
  
  try {
    await window.gapi.client.drive.files.delete({
      fileId: fileId,
    });
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};
