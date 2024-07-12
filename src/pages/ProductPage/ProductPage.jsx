import React, {useState, useEffect} from 'react';
import {Table, Popconfirm, Modal, Button, message, Form, Input, Select, Typography} from 'antd';
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
				<div>
					{record.image.length > 0 && (
						<img
							src={record.image[0]} // Display the first image URL in the array
							alt={productName}
							style={{width: '50px', height: 'auto'}}
						/>
					)}
					<span style={{marginLeft: '10px'}}>{productName}</span>
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
			render: (price) => `$${price}`,
		},
		{
			title: 'Action',
			key: 'action',
			render: (text, record) => (
				<div>
					<Button type="link" onClick={() => showDetailModal(record)}>
						View Details
					</Button>
					<Button type="link" onClick={() => showUpdateModal(record)}>
						Update
					</Button>
				</div>
			),
		},
	];
	const handleDeleteConfirm = () => {
		console.log('Deleting product...');
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
		console.log('Delete canceled.');
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
			productName: record.productName,
			diamondType: record.diamondId.type,
			shellName: record.shellId.shellName,
			category: record.shellId.category,
			materialName: record.materialId.materialName,
			price: record.price,
			description: record.description,
		});
		setUpdateModalVisible(true);
	};

	const handleUpdate = () => {
		if (!selectedProduct) return;

		axios
			.patch(
				`http://localhost:8000/api/products/update/${selectedProduct._id}`,
				{quantity: updateFormData.quantity} // Only update quantity
			)
			.then((response) => {
				message.success('Product quantity updated successfully');
				fetchProductsFromAPI(); // Refresh productsData after update
				setUpdateModalVisible(false);
			})
			.catch((error) => {
				message.error('Failed to update product quantity');
				console.error('Error updating product quantity:', error);
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
		const selectedDiamond = diamondTypes.find((diamond) => diamond._id === value);
		handleCreateFormChange('diamondType', selectedDiamond.type);
	};
	const handleMaterialChange = (value) => {
		const selectedMaterial = materials.find((material) => material._id === value);
		handleCreateFormChange('materialName', selectedMaterial.materialName);
		setSelectedMaterial(value);
	};
	const handleShellChange = (value) => {
		const selectedShell = shells.find((shell) => shell._id === value);
		handleCreateFormChange('shellName', selectedShell.shellName);
		setSelectedShellCategory(selectedShell.category); // Set the category of the selected shell
		setSelectedShell(value);
	};
	return (
		<div className={styles.container}>
			<h1 className={styles.title}>Products Page</h1>
			<div
				style={{
					width: '100%',
					display: 'flex',
					justifyContent: 'flex-end', // Align items to the end of the container
					marginBottom: '20px', // Optional: Add margin bottom for spacing
				}}
			>
				<Button type="primary" onClick={showCreateModal}>
					Create Product
				</Button>
			</div>

			<Table
				dataSource={productsData}
				columns={columns}
				rowKey="_id"
				className={styles.table}
			/>

			{/* Detail Modal */}
			<Modal
				title="Product Details"
				visible={visible}
				onCancel={handleCancel}
				footer={[
					<div style={{display: 'flex', width:'100%', justifyContent:'space-between'}}>
						<div className={styles.actionButtons}>
							<Button
								type="danger"
								onClick={() => setConfirmDeleteVisible(true)}
								className={styles.deleteButton}
							>
								Delete
							</Button>
							<Popconfirm
								title="Are you sure you want to delete this product?"
								visible={confirmDeleteVisible}
								onConfirm={handleDeleteConfirm}
								onCancel={handleCancelDelete}
								okText="Yes"
								cancelText="No"
							/>
						</div>
						
						<Button key="close" onClick={handleCancel}>
							Close
						</Button>
						
					</div>,
				]}
			>
				{selectedProduct && (
					<div className={styles.detailContainer}>
						<div className={styles.detailImages}>
							<img
								src={selectedProduct.image[currentImageIndex]}
								alt={`Product ${currentImageIndex}`}
								className={styles.productImage}
							/>
							{selectedProduct.image.length > 1 && (
								<div className={styles.imageControls}>
									<Button onClick={prevImage}>Previous</Button>
									<Button onClick={nextImage}>Next</Button>
								</div>
							)}
						</div>
						<div className={styles.detailContent}>
							<h2>{selectedProduct.productName}</h2>
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
								<strong>Quantity:</strong> {selectedProduct.quantity}
							</p>
							<p>
								<strong>Price:</strong> ${selectedProduct.price.toFixed(2)}
							</p>
							<p>
								<strong>Description:</strong> {selectedProduct.description}
							</p>
							<div className={styles.metadata}>
								<p>
									<strong>Created At:</strong> {selectedProduct.createdAt}
								</p>
								<p>
									<strong>Updated At:</strong> {selectedProduct.updatedAt}
								</p>
								{/* Add other fields as needed */}
							</div>
						</div>
					</div>
				)}
			</Modal>

			{/* Update Modal */}
			<Modal
				title="Update Product"
				visible={updateModalVisible}
				onOk={handleUpdate}
				onCancel={handleCancelUpdate}
				footer={[
					<Button key="cancel" onClick={handleCancelUpdate}>
						Cancel
					</Button>,
					<Button key="update" type="primary" onClick={handleUpdate}>
						Update
					</Button>,
				]}
			>
				<Form>
					<Form.Item label="Quantity">
						<Input
							type="number"
							value={updateFormData.quantity}
							onChange={(e) => handleUpdateFormChange('quantity', e.target.value)}
						/>
					</Form.Item>
				</Form>
			</Modal>

			{/* Create Modal */}
			<Modal
				title="Create Product"
				visible={createModalVisible}
				onOk={handleCreate}
				onCancel={handleCancelCreate}
				footer={[
					<Button key="cancel" onClick={handleCancelCreate}>
						Cancel
					</Button>,
					<Button key="create" type="primary" onClick={handleCreate}>
						Create
					</Button>,
				]}
			>
				<Form>
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
									{diamond.type}-{diamond.carat}-{diamond.cut}-{diamond.color}-
									{diamond.clarity}
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
									{shell.shellName}-{shell.category}
								</Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item label="Category">
						<Typography.Text>{selectedShellCategory}</Typography.Text>
					</Form.Item>
					<Form.Item label="Material">
						<Select
							showSearch
							value={selectedMaterial}
							onChange={handleMaterialChange}
							placeholder="Search and select a material"
						>
							{materials.map((material) => (
								<Option key={material._id} value={material._id}>
									{material.materialName}
								</Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item label="Price">
						<Input
							type="number"
							value={createFormData.price}
							onChange={(e) => handleCreateFormChange('price', e.target.value)}
						/>
					</Form.Item>
					<Form.Item label="Quantity">
						<Input
							value={createFormData.quantity}
							onChange={(e) => handleCreateFormChange('quantity', e.target.value)}
						/>
					</Form.Item>
					<Form.Item label="Description">
						<Input.TextArea
							rows={4}
							value={createFormData.description}
							onChange={(e) => handleCreateFormChange('description', e.target.value)}
						/>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default ProductPage;
