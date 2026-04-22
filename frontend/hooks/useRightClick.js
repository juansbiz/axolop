export const useRightClick = (options = {}) => {
  const handleContextMenu = (e) => {
    e.preventDefault();
  };
  return { handleContextMenu };
};

export default useRightClick;
