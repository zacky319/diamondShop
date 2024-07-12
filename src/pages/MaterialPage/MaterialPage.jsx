import React, { useState, useEffect } from 'react';
import { Table, Modal, Button, message, Form, Input } from 'antd';
import axios from 'axios';
import styles from './MaterialPage.module.css'; // Import your module.css for styling

const MaterialPage = () => {
  const [materialsData, setMaterialsData] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [visible, setVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [materialName, setMaterialName] = useState('');

  useEffect(() => {
    fetchMaterialsFromAPI();
  }, []);

  const fetchMaterialsFromAPI = () => {
    axios
      .get('http://localhost:8000/api/materials/')
      .then(response => {
        setMaterialsData(response.data);  
      })
      .catch(error => {
        console.error('Error fetching materials data:', error);
      });
  };

  const columns = [
    {
      title: 'Material Name',
      dataIndex: 'materialName',
      key: 'materialName',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Button type="link" onClick={() => showDetailModal(record)}>View Details</Button>
      ),
    },
  ];

  const showDetailModal = (record) => {
    setSelectedMaterial(record);
    setVisible(true);
  };

  const handleDelete = () => {
    if (!selectedMaterial) return;
    
    axios
      .delete(`http://localhost:8000/api/materials/delete/${selectedMaterial._id}`)
      .then(response => {
        message.success('Material deleted successfully');
        fetchMaterialsFromAPI(); // Refresh materialsData after deletion
        setVisible(false);
      })
      .catch(error => {
        message.error('Failed to delete material');
        console.error('Error deleting material:', error);
      });
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleAddModalOk = () => {
	if (!materialName.trim()) {
	  message.error('Please enter a material name');
	  return;
	}
  
	// Assuming your backend expects an object with { materialName: 'Copper' }
	axios
	  .post('http://localhost:8000/api/materials/', { materialName: materialName.trim() })
	  .then(response => {
		message.success('Material added successfully');
		setAddModalVisible(false);
		setMaterialName(''); // Clear the input field
		fetchMaterialsFromAPI(); // Refresh materialsData after adding
	  })
	  .catch(error => {
		message.error('Failed to add material');
		console.error('Error adding material:', error);
	  });
  };
  
  
  

  const handleAddModalCancel = () => {
    setAddModalVisible(false);
    setMaterialName('');
  };

  const handleNewMaterialNameChange = (e) => {
    setMaterialName(e.target.value);
  };

  const showAddModal = () => {
    setAddModalVisible(true);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Materials Page</h1>

      <div className={styles.ButtonContainer}>
        <Button type="primary" onClick={showAddModal}>
          Add Material
        </Button>
      </div>

      <Table dataSource={materialsData} columns={columns} rowKey="_id" className={styles.table} />

      <Modal
        title="Material Details"
        visible={visible}
        onOk={handleDelete}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>Cancel</Button>,
          <Button key="delete" type="primary" danger onClick={handleDelete}>Delete</Button>,
        ]}
      >
        {selectedMaterial && (
          <div className={styles.detailContainer}>
            <div className={styles.detailLeft}>
              <p><strong>Material Name:</strong> {selectedMaterial.materialName}</p>
            </div>
            <div className={styles.detailRight}>
              <p><strong>Created At:</strong> {selectedMaterial.createdAt}</p>
              <p><strong>Updated At:</strong> {selectedMaterial.updatedAt}</p>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        title="Add Material"
        visible={addModalVisible}
        onOk={handleAddModalOk}
        onCancel={handleAddModalCancel}
      >
        <Form>
          <Form.Item label="Material Name">
            <Input value={materialName} onChange={handleNewMaterialNameChange} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MaterialPage;
