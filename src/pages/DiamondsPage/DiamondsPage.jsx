import React, { useState, useEffect } from 'react';
import { Table, Modal, Button, message, Form, Input } from 'antd';
import axios from 'axios';
import { fetchDiamonds, deleteDiamond, addDiamond } from '../../redux/slices/diamondSlice'; // Assuming you have Redux actions defined
import styles from './DiamondPage.module.css';

const DiamondsPage = () => {
  const [diamondsData, setDiamondsData] = useState([]);
  const [selectedDiamond, setSelectedDiamond] = useState(null);
  const [visible, setVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newDiamond, setNewDiamond] = useState({
    type: '',
    carat: '',
    cut: '',
    color: '',
    clarity: ''
  });

  useEffect(() => {
    fetchDiamondsFromAPI();
  }, []);

  const fetchDiamondsFromAPI = () => {
    axios
      .get('http://localhost:8000/api/diamonds/')
      .then((response) => {
        setDiamondsData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching diamonds data:', error);
      });
  };

  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Carat',
      dataIndex: 'carat',
      key: 'carat',
    },
    {
      title: 'Cut',
      dataIndex: 'cut',
      key: 'cut',
    },
    {
      title: 'Color',
      dataIndex: 'color',
      key: 'color',
    },
    {
      title: 'Clarity',
      dataIndex: 'clarity',
      key: 'clarity',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Button type="link" onClick={() => showDetailModal(record)}>
          View Details
        </Button>
      ),
      className: styles.actionColumn,
    },
  ];

  const showDetailModal = (record) => {
    setSelectedDiamond(record);
    setVisible(true);
  };

  const handleDelete = () => {
    if (!selectedDiamond) return;

    axios
      .delete(`http://localhost:8000/api/diamonds/delete/${selectedDiamond._id}`)
      .then((response) => {
        message.success('Diamond deleted successfully');
        fetchDiamondsFromAPI();
        setVisible(false);
      })
      .catch((error) => {
        message.error('Failed to delete diamond');
        console.error('Error deleting diamond:', error);
      });
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleAddModalOk = () => {
    axios
      .post('http://localhost:8000/api/diamonds/', newDiamond)
      .then((response) => {
        message.success('Diamond added successfully');
        setAddModalVisible(false);
        fetchDiamondsFromAPI();
      })
      .catch((error) => {
        message.error('Failed to add diamond');
        console.error('Error adding diamond:', error);
      });
  };

  const handleAddModalCancel = () => {
    setAddModalVisible(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDiamond({ ...newDiamond, [name]: value });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Diamonds Page</h1>
      <div className={styles.buttonContainer}>
        <Button type="primary" onClick={() => setAddModalVisible(true)}>
          Add Diamond
        </Button>
      </div>
      <Table dataSource={diamondsData} columns={columns} rowKey="_id" className={styles.table} />

      <Modal
        title="Diamond Details"
        visible={visible}
        onOk={handleDelete}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="delete" type="primary" danger onClick={handleDelete}>
            Delete
          </Button>,
        ]}
      >
        {selectedDiamond && (
          <div className={styles.detailContainer}>
            <div className={styles.detailLeft}>
              <p className={styles.detailSection}>
                <strong>Type:</strong> {selectedDiamond.type}
              </p>
              <p className={styles.detailSection}>
                <strong>Carat:</strong> {selectedDiamond.carat}
              </p>
              <p className={styles.detailSection}>
                <strong>Cut:</strong> {selectedDiamond.cut}
              </p>
              <p className={styles.detailSection}>
                <strong>Color:</strong> {selectedDiamond.color}
              </p>
            </div>
            <div className={styles.detailRight}>
              <p className={styles.detailSection}>
                <strong>Clarity:</strong> {selectedDiamond.clarity}
              </p>
              <p className={styles.detailSection}>
                <strong>Created At:</strong> {selectedDiamond.createdAt}
              </p>
              <p className={styles.detailSection}>
                <strong>Updated At:</strong> {selectedDiamond.updatedAt}
              </p>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        title="Add New Diamond"
        visible={addModalVisible}
        onOk={handleAddModalOk}
        onCancel={handleAddModalCancel}
      >
        <Form layout="vertical">
          <Form.Item label="Type">
            <Input name="type" value={newDiamond.type} onChange={handleInputChange} />
          </Form.Item>
          <Form.Item label="Carat">
            <Input name="carat" value={newDiamond.carat} onChange={handleInputChange} />
          </Form.Item>
          <Form.Item label="Cut">
            <Input name="cut" value={newDiamond.cut} onChange={handleInputChange} />
          </Form.Item>
          <Form.Item label="Color">
            <Input name="color" value={newDiamond.color} onChange={handleInputChange} />
          </Form.Item>
          <Form.Item label="Clarity">
            <Input name="clarity" value={newDiamond.clarity} onChange={handleInputChange} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DiamondsPage;
