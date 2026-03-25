import { useState, useCallback } from 'react';
import { documentAPI, sectionAPI, yearlyProgressAPI } from '../api/api';

// Hook for documents
export const useDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDocuments = useCallback(async (params) => {
    setLoading(true);
    try {
      const response = await documentAPI.getAll(params);
      setDocuments(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createDocument = useCallback(async (data) => {
    try {
      const response = await documentAPI.create(data);
      setDocuments(prev => [response.data.data, ...prev]);
      return response.data.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const updateDocument = useCallback(async (id, data) => {
    try {
      const response = await documentAPI.update(id, data);
      setDocuments(prev =>
        prev.map(doc => doc._id === id ? response.data.data : doc)
      );
      return response.data.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const deleteDocument = useCallback(async (id) => {
    try {
      await documentAPI.delete(id);
      setDocuments(prev => prev.filter(doc => doc._id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  return {
    documents,
    setDocuments,
    loading,
    error,
    fetchDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
  };
};

// Hook for sections
export const useSections = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSections = useCallback(async (documentId) => {
    setLoading(true);
    try {
      const response = await sectionAPI.getByDocument(documentId);
      setSections(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createSection = useCallback(async (data) => {
    try {
      const response = await sectionAPI.create(data);
      setSections(prev => [response.data.data, ...prev]);
      return response.data.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const updateSection = useCallback(async (id, data) => {
    try {
      const response = await sectionAPI.update(id, data);
      setSections(prev =>
        prev.map(section => section._id === id ? response.data.data : section)
      );
      return response.data.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const deleteSection = useCallback(async (id) => {
    try {
      await sectionAPI.delete(id);
      setSections(prev => prev.filter(section => section._id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  return {
    sections,
    setSections,
    loading,
    error,
    fetchSections,
    createSection,
    updateSection,
    deleteSection,
  };
};

// Hook for yearly progress
export const useYearlyProgress = () => {
  const [progressList, setProgressList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProgress = useCallback(async (sectionId) => {
    setLoading(true);
    try {
      const response = await yearlyProgressAPI.getBySection(sectionId);
      setProgressList(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createOrUpdateProgress = useCallback(async (data) => {
    try {
      const response = await yearlyProgressAPI.createOrUpdate(data);
      setProgressList(prev => {
        const existing = prev.find(p => p._id === response.data.data._id);
        if (existing) {
          return prev.map(p => p._id === response.data.data._id ? response.data.data : p);
        }
        return [...prev, response.data.data];
      });
      return response.data.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const deleteProgress = useCallback(async (id) => {
    try {
      await yearlyProgressAPI.delete(id);
      setProgressList(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  return {
    progressList,
    setProgressList,
    loading,
    error,
    fetchProgress,
    createOrUpdateProgress,
    deleteProgress,
  };
};
