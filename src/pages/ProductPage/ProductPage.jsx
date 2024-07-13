import React, {useState, useEffect} from 'react';
import {Table, Popconfirm, Modal, Button, message, Form, Input, Select, Typography} from 'antd';
import {EyeOutlined, EditOutlined, DeleteOutlined} from '@ant-design/icons';
import axios from 'axios';
import styles from './ProductPage.module.css'; // Import your module.css for styling

const {Option} = Select;

const ProductPage = () => {
	const [productsData, setProductsData] = useState([]);
	const [selectedProduct, setSelectedProduct] = useState(null);
	const [visible, setVisible] = useState(false);
	const [currentImageIndex, setCurrentImageIndex] = useState(0); // State to track current image index

	const [updateModalVisible, setUpdateModalVisible] = useState(false);
	const [updateFormData, setUpdateFormData] = useState({});
	const [createModalVisible, setCreateModalVisible] = useState(false);
	const [createFormData, setCreateFormData] = useState({
		productName: '',
		diamondType: '',
		shellName: '',
		category: '',
		materialName: '',
		price: '',
		description: '',
	});
	const [diamondTypes, setDiamondTypes] = useState([]);
	const [selectedDiamondType, setSelectedDiamondType] = useState(null);
	const [materials, setMaterials] = useState([]);
	const [selectedMaterial, setSelectedMaterial] = useState(null);
	const [shells, setShells] = useState([]);
	const [selectedShell, setSelectedShell] = useState(null);
	const [selectedShellCategory, setSelectedShellCategory] = useState('');
	const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);

	useEffect(() => {
		fetchProductsFromAPI();
		fetchDiamondTypes();
		fetchMaterials();
		fetchShells();
	}, []);
	useEffect(() => {
		let interval;
		if (visible && selectedProduct && selectedProduct.image.length > 1) {
			interval = setInterval(() => {
				setCurrentImageIndex((prevIndex) => (prevIndex + 1) % selectedProduct.image.length);
			}, 2000); // Change image every 2 seconds
		}
		return () => {
			clearInterval(interval);
		};
	}, [visible, selectedProduct]);
	const fetchProductsFromAPI = () => {
		axios
			.get('http://localhost:8000/api/products/')
			.then((response) => {
				setProductsData(response.data);
			})
			.catch((error) => {
				console.error('Error fetching products data:', error);
			});
	};
	const fetchDiamondTypes = () => {
		axios
			.get('http://localhost:8000/api/diamonds/')
			.then((response) => {
				setDiamondTypes(response.data);
			})
			.catch((error) => {
				console.error('Error fetching diamond types:', error);
			});
	};
	const fetchMaterials = () => {
		axios
			.get('http://localhost:8000/api/materials/')
			.then((response) => {
				setMaterials(response.data);
			})
			.catch((error) => {
				console.error('Error fetching materials:', error);
			});
	};
	const fetchShells = () => {
		axios
			.get('http://localhost:8000/api/shells/')
			.then((response) => {
				setShells(response.data);
			})
			.catch((error) => {
				console.error('Error fetching shells:', error);
			});
	};
	const columns = [
		{
			title: 'Product Name',
			dataIndex: 'productName',
			key: 'productName',
			render: (productName, record) => (
				<div className={styles.productName}>
					{record.image.length > 0 && (
						<img
							src={record.image[0]} // Display the first image URL in the array
							alt={productName}
							className={styles.productImageThumbnail}
						/>
					)}
					<span className={styles.productNameText}>{productName}</span>
				</div>
			),
		},
		{
			title: 'Diamond Type',
			dataIndex: ['diamondId', 'type'],
			key: 'diamondType',
		},
		{
			title: 'Shell Name',
			dataIndex: ['shellId', 'shellName'],
			key: 'shellName',
		},
		{
			title: 'Category',
			dataIndex: ['shellId', 'category'],
			key: 'category',
		},
		{
			title: 'Material',
			dataIndex: ['materialId', 'materialName'],
			key: 'materialName',
		},
		{
			title: 'Price',
			dataIndex: 'price',
			key: 'price',
			render: (price) => `$${price.toFixed(2)}`,
		},
		{
			title: 'Action',
			key: 'action',
			render: (text, record) => (
				<div className={styles.actionButtons}>
					<Button
						type="link"
						icon={<EyeOutlined />}
						onClick={() => showDetailModal(record)}
					/>
					<Button
						type="link"
						icon={<EditOutlined />}
						onClick={() => showUpdateModal(record)}
					/>
				</div>
			),
		},
	];
	const handleDeleteConfirm = () => {
		if (!selectedProduct) return;

		axios
			.delete(`http://localhost:8000/api/products/delete/${selectedProduct._id}`)
			.then((response) => {
				message.success('Product deleted successfully');
				fetchProductsFromAPI(); // Refresh productsData after deletion
				setVisible(false);
			})
			.catch((error) => {
				message.error('Failed to delete product');
				console.error('Error deleting product:', error);
			});
		setConfirmDeleteVisible(false);
	};

	const handleCancelDelete = () => {
		setConfirmDeleteVisible(false);
	};
	const showDetailModal = (record) => {
		setSelectedProduct(record);
		setVisible(true);
		setCurrentImageIndex(0); // Reset to first image when modal opens
	};
	const nextImage = () => {
		setCurrentImageIndex((prevIndex) => (prevIndex + 1) % selectedProduct.image.length);
	};

	// Function to handle previous image in slideshow
	const prevImage = () => {
		setCurrentImageIndex((prevIndex) =>
			prevIndex === 0 ? selectedProduct.image.length - 1 : prevIndex - 1
		);
	};
	const handleDelete = () => {
		if (!selectedProduct) return;

		axios
			.delete(`http://localhost:8000/api/products/delete/${selectedProduct._id}`)
			.then((response) => {
				message.success('Product deleted successfully');
				fetchProductsFromAPI(); // Refresh productsData after deletion
				setVisible(false);
			})
			.catch((error) => {
				message.error('Failed to delete product');
				console.error('Error deleting product:', error);
			});
	};

	const showUpdateModal = (record) => {
		setSelectedProduct(record);
		setUpdateFormData({
			quantity: record.quantity, // Add quantity field
		});
		setUpdateModalVisible(true);
	};

	const handleUpdate = () => {
		if (!selectedProduct) return;

		axios
			.patch(
				`http://localhost:8000/api/products/update/${selectedProduct._id}`,
				updateFormData
			)
			.then((response) => {
				message.success('Product updated successfully');
				fetchProductsFromAPI(); // Refresh productsData after update
				setUpdateModalVisible(false);
			})
			.catch((error) => {
				message.error('Failed to update product');
				console.error('Error updating product:', error);
			});
	};

	const handleCancelUpdate = () => {
		setUpdateModalVisible(false);
	};

	const handleCancel = () => {
		setVisible(false);
	};

	const handleUpdateFormChange = (fieldName, value) => {
		setUpdateFormData({
			...updateFormData,
			[fieldName]: value,
		});
	};

	const showCreateModal = () => {
		setCreateModalVisible(true);
	};

	const handleCreate = () => {
		axios
			.post('http://localhost:8000/api/products/', {
				productName: createFormData.productName,
				diamondId: selectedDiamondType,
				shellId: selectedShell,
				materialId: selectedMaterial,
				price: createFormData.price,
				description: createFormData.description,
				quantity: createFormData.quantity, // Ensure quantity is included
			})
			.then((response) => {
				message.success('Product created successfully');
				fetchProductsFromAPI(); // Refresh productsData after creation
				setCreateModalVisible(false);
				setCreateFormData({
					productName: '',
					diamondId: '',
					shellId: '',
					materialId: '',
					price: '',
					description: '',
					quantity: '', // Reset quantity after successful creation
				});
			})
			.catch((error) => {
				message.error('Failed to create product');
				console.error('Error creating product:', error);
			});
	};

	const handleCancelCreate = () => {
		setCreateModalVisible(false);
	};

	const handleCreateFormChange = (fieldName, value) => {
		setCreateFormData({
			...createFormData,
			[fieldName]: value,
		});
	};

	const handleDiamondTypeChange = (value) => {
		setSelectedDiamondType(value);
	};

	const handleMaterialChange = (value) => {
		setSelectedMaterial(value);
	};

	const handleShellChange = (value) => {
		const selectedShell = shells.find((shell) => shell._id === value);
		setSelectedShell(value);
		setSelectedShellCategory(selectedShell ? selectedShell.category : '');
	};

	return (
		<div className={styles.container}>
			<Typography.Title level={2} className={styles.title}>
				Product Management
			</Typography.Title>
			<Button type="primary" onClick={showCreateModal} className={styles.createButton}>
				Create Product
			</Button>
			<Table
				dataSource={productsData}
				columns={columns}
				rowKey={(record) => record._id}
				className={styles.table}
				pagination={{pageSize: 8}}
			/>
			<Modal
				title="Product Details"
				visible={visible}
				onCancel={handleCancel}
				footer={[
					<Button
						key="delete"
						type="danger"
						icon={<DeleteOutlined />}
						onClick={() => setConfirmDeleteVisible(true)}
						style={{background: 'red', color: 'white'}} // Show confirm delete modal
					>
						Delete
					</Button>,
				]}
				width={800}
			>
				{selectedProduct && (
					<div className={styles.detailContainer}>
						<div className={styles.imageControls}>
							<Button onClick={prevImage}>Previous</Button>
							<img
								src={selectedProduct.image[currentImageIndex]}
								alt={selectedProduct.productName}
								className={styles.productImage}
							/>
							<Button onClick={nextImage}>Next</Button>
						</div>
						<div className={styles.detailSection}>
							<p>
								<strong>Product Name:</strong> {selectedProduct.productName}
							</p>
							<p>
								<strong>Diamond Type:</strong> {selectedProduct.diamondId.type}
							</p>
							<p>
								<strong>Shell Name:</strong> {selectedProduct.shellId.shellName}
							</p>
							<p>
								<strong>Category:</strong> {selectedProduct.shellId.category}
							</p>
							<p>
								<strong>Material:</strong> {selectedProduct.materialId.materialName}
							</p>
							<p>
								<strong>Price:</strong> ${selectedProduct.price.toFixed(2)}
							</p>
							<p>
								<strong>Description:</strong> {selectedProduct.description}
							</p>
							<p>
								<strong>Quantity:</strong> {selectedProduct.quantity}
							</p>
						</div>
					</div>
				)}
			</Modal>
			<Modal
				title="Update Product"
				visible={updateModalVisible}
				onCancel={handleCancelUpdate}
				onOk={handleUpdate}
				width={800}
			>
				<Form layout="vertical">
					<Form.Item label="Quantity">
						<Input
							type="number"
							value={updateFormData.quantity}
							onChange={(e) => handleUpdateFormChange('quantity', e.target.value)}
						/>
					</Form.Item>
				</Form>
			</Modal>
			<Modal
				title="Create Product"
				visible={createModalVisible}
				onCancel={handleCancelCreate}
				onOk={handleCreate}
				width={800}
			>
				<Form layout="vertical">
					<Form.Item label="Product Name">
						<Input
							value={createFormData.productName}
							onChange={(e) => handleCreateFormChange('productName', e.target.value)}
						/>
					</Form.Item>
					<Form.Item label="Diamond Type">
						<Select
							showSearch
							value={selectedDiamondType}
							onChange={handleDiamondTypeChange}
							filterOption={(input, option) =>
								option.children.toLowerCase().includes(input.toLowerCase())
							}
						>
							{diamondTypes.map((diamond) => (
								<Option key={diamond._id} value={diamond._id}>
									{diamond.type}
								</Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item label="Shell Name">
						<Select
							showSearch
							value={selectedShell}
							onChange={handleShellChange}
							filterOption={(input, option) =>
								option.children.toLowerCase().includes(input.toLowerCase())
							}
						>
							{shells.map((shell) => (
								<Option key={shell._id} value={shell._id}>
									{shell.shellName}
								</Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item label="Material Name">
						<Select
							showSearch
							value={selectedMaterial}
							onChange={handleMaterialChange}
							filterOption={(input, option) =>
								option.children.toLowerCase().includes(input.toLowerCase())
							}
						>
							{materials.map((material) => (
								<Option key={material._id} value={material._id}>
									{material.materialName}
								</Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item label="Category">
						<Input value={selectedShellCategory} readOnly />
					</Form.Item>

					<Form.Item label="Price">
						<Input
							type="number"
							value={createFormData.price}
							onChange={(e) => handleCreateFormChange('price', e.target.value)}
						/>
					</Form.Item>
					<Form.Item label="Description">
						<Input.TextArea
							value={createFormData.description}
							onChange={(e) => handleCreateFormChange('description', e.target.value)}
						/>
					</Form.Item>
					<Form.Item label="Quantity">
						<Input
							type="number"
							value={createFormData.quantity}
							onChange={(e) => handleCreateFormChange('quantity', e.target.value)}
						/>
					</Form.Item>
				</Form>
			</Modal>
			<Modal
				title="Confirm Deletion"
				visible={confirmDeleteVisible}
				onOk={handleDeleteConfirm}
				onCancel={handleCancelDelete}
			>
				<p>Are you sure you want to delete this product?</p>
			</Modal>
		</div>
	);
};

export default ProductPage;
