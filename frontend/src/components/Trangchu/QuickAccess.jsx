import { useAuth } from '../../contexts/AuthContext';

const QuickAccess = () => {
  const { user } = useAuth();

  return (
    <div className="quick-access">
      <div className="quick-container">

        <a href="/tim-kiem" className="quick-item search">
          <span>TÌM KIẾM VĂN BẢN</span>
        </a>

        <a href="/theo-doi-tien-do" className="quick-item progress">
          <span>THEO DÕI TIẾN ĐỘ</span>
        </a>

        {user?.role === 'admin' && (
          <a href="/admin/users" className="quick-item account">
            <span>QUẢN LÝ TÀI KHOẢN</span>
          </a>
        )}

      </div>
    </div>
  );
};

export default QuickAccess;