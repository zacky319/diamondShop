import React, { useState } from 'react';
import { BellOutlined } from '@ant-design/icons';
import { Avatar, Button, Popover, message, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import styles from './TopNavBar.module.css'; // Import CSS module file for styling
import profileImage from './profileImage.jpg'; // Import a sample profile image for illustration
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/userLoginSlice'; // Import the logout action from userLoginSlice

const TopNavbar = () => {
  const user = useSelector(state => state.userLogin.user); // Access user state from Redux store
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleBellClick = () => {
    // Handle notification bell click
  };

  const handleProfileClick = () => {
    setShowSignOutPopup(false); // Close the sign-out popup if open
    setShowSignOutButton(!showSignOutButton); // Toggle sign-out button visibility
  };

  const handleSignOut = () => {
    dispatch(logout()); // Dispatch logout action to clear user state
    localStorage.removeItem('user'); // Remove user from local storage if needed
    message.success('Logout successful!');
    navigate('/login');
  };

  const [showSignOutPopup, setShowSignOutPopup] = useState(false);
  const [showSignOutButton, setShowSignOutButton] = useState(false);

  const handleCancelSignOut = () => {
    setShowSignOutButton(false); // Hide the sign-out button
  };

  const handleConfirmSignOut = () => {
    handleSignOut();
  };

  return (
    <div className={styles.topNavbar}>
      <div className={styles.rightSection}>
        <div className={styles.notificationIconContainer} onClick={handleBellClick}>
          <BellOutlined className={styles.notificationIcon} />
          {/* Notification dropdown */}
        </div>
        <div className={styles.profileContainer}>
          <Avatar
            src={user?.avatar_url || profileImage}
            alt="Profile"
            className={styles.profileImage}
            onClick={handleProfileClick}
          />
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user?.name}</span>
            <span className={styles.userRole}>{user?.role}</span>
          </div>
          {showSignOutButton && (
            <Popover
              placement="bottomRight"
              content={
                <div className={styles.signOutPopup}>
                  <span className={styles.signOutText}>Are you sure you want to sign out?</span>
                  <div className={styles.signOutButtons}>
                    <Button className={styles.confirmButton} onClick={handleConfirmSignOut}>
                      Yes
                    </Button>
                    <Button className={styles.cancelButton} onClick={handleCancelSignOut}>
                      Cancel
                    </Button>
                  </div>
                </div>
              }
              trigger="click"
              visible={showSignOutButton}
              onVisibleChange={(visible) => setShowSignOutButton(visible)}
            >
              <Button className={styles.signOutButton}>Sign Out</Button>
            </Popover>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;
