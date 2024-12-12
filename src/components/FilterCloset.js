import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Container, Row, Col } from "styled-bootstrap-grid";
import { TiArrowSortedDown } from "react-icons/ti";
import { FaCircleCheck } from "react-icons/fa6";
import DetailsPopup from "../Popup/DetailsPopup";
import { LiaSearchSolid } from "react-icons/lia";
import { CiEdit } from "react-icons/ci";
import OldSuggestedOutfits from "../Popup/OldSuggestedOutfits";
import { ThemeProvider } from "styled-components";

const ClosetApp = ({ isNightMode }) => {
  const [open, setOpen] = useState(false);
  const [openOldSuggestedPopup, setOpenOldSuggestedPopup] = useState(false);
  //const closeModal = () => setOpen(false);

  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [detailProduct, setDetailProduct] = useState("");
  const [selectedOutfits, setSelectedOutfits] = useState(4);
  const [showEditImagePopUp, setShowEditImagePoUp] = useState(false);
  const [showDetailsPopUp, setShowDetailsPopUp] = useState(false);
  const [oldSuggestedArray, setOldSuggestedArray] = useState([]);
  const [finalizedSuggestedArray, setFinalizedSuggestedArray] = useState([]); 

  const [filters, setFilters] = useState({
    color: "",
    material: "",
    name: "",
    dresstype: "",
    price: "",
    specificColor: "",
    stats: "least-recently-worn",
    viewOutfits: 4,
  });
  const [productRatings, setProductRatings] = useState({});
  const [brokenImages, setBrokenImages] = useState([]);
  const [brokenImageProduct, setBrokenImageProduct] = useState("");
  const handleSendToMobile = () => {
    // Check if any item from oldSuggestedArray is already in finalizedSuggestedArray to prevent duplicates
    const filteredOldSuggestedArray = oldSuggestedArray.filter(item => 
      !finalizedSuggestedArray.some(finalItem => finalItem.dressId === item.dressId)
    );
  
    // Merge the filtered array (without duplicates) into finalizedSuggestedArray
    setFinalizedSuggestedArray((prev) => [...prev, ...filteredOldSuggestedArray]);
  
    // Clear oldSuggestedArray
    setOldSuggestedArray([]);
  
    // Clear carts (if needed)
    clearCarts();
  };;

  const closeModal = () => {
    setOpen(false);
    setShowEditImagePoUp(false);
    setShowDetailsPopUp(false);
  };
  const closeModalOldSuggestedOutfits = () => {
    setOpenOldSuggestedPopup(false);
    // setShowEditImagePoUp(false)
    // setShowDetailsPopUp(false)
  };

  const handleBrokenImage = (dressId) => {
    setBrokenImages((prevBrokenImages) => [...prevBrokenImages, dressId]);
  };
  const handleRating = (productId, newRating) => {
    setProductRatings({
      ...productRatings,
      [productId]: newRating,
    });
  };

  const handleBrokenImageFunction = (product) => {
    setBrokenImageProduct(product);
    setShowEditImagePoUp(true);
    setOpen(true);
  };

  const fetchProductData = async () => {
    const response = await fetch("/data.json");
    const data = await response.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProductData();
  }, []);

  const getUniqueValues = (array, key) => {
    return [...new Set(array.map((item) => item[key]))].sort();
  };

  const getUniqueColors = (array) => {
    const colors = array.flatMap((item) => item.color.split("/")); // Only process colors with a '/'

    return [...new Set(colors)].sort(); // Sort the unique colors alphabetically
  };

  const getSpecificColors = (array) => {
    const colors = array
      // .filter((item) => item.color.includes("/")) // Only process colors with a '/'
      .flatMap((item) => item.color);

    return [...new Set(colors)].sort();
  };

  const filteredProducts = products
    .filter((product) => {
      const colorMatch =
        !filters.color ||
        product.color
          .split("/")
          .some((color) => color.trim() === filters.color);
      const specificColorMatch =
        !filters.specificColor || product.color === filters.specificColor;
      const searchMatch =
        !filters.search ||
        [
          product.name,
          product.tags,
          product.dresstype,
          product.material,
          product.color,
          product.location,
        ].some((field) =>
          field?.toLowerCase().includes(filters.search.toLowerCase())
        );

      return (
        specificColorMatch && // Prioritize specificColor first
        colorMatch && // Then match general color
        (!filters.material || product.material === filters.material) &&
        (!filters.dresstype || product.dresstype === filters.dresstype) &&
        (!filters.name || product.name === filters.name) &&
        (!filters.price || product.price === filters.price) &&
        searchMatch
      );
    })

    .sort((a, b) => {
      switch (filters.stats) {
        case "old-new":
          return (a.insertDate || 0) - (b.insertDate || 0);
        case "new-old":
          return (b.insertDate || 0) - (a.insertDate || 0);
        case "brand-a-z":
          return (a.name || "")
            .toLowerCase()
            .localeCompare((b.name || "").toLowerCase());
        case "brand-z-a":
          return (b.name || "")
            .toLowerCase()
            .localeCompare((a.name || "").toLowerCase());

        case "least-recently-worn":
          return a.lastworn - b.lastworn;
        case "most-recently-worn":
          return b.lastworn - a.lastworn;
        case "least-included-fits":
          return a.pastFitCount - b.pastFitCount;
        case "most-included-fits":
          return b.pastFitCount - a.pastFitCount;
        default:
          return 0;
      }
    });

  const uniqueColors = getUniqueColors(filteredProducts, "color");
  const uniqueMaterials = getUniqueValues(filteredProducts, "material");
  const uniqueTypes = getUniqueValues(filteredProducts, "dresstype");
  const uniqueBrands = getUniqueValues(filteredProducts, "name");
  const uniquePrices = getUniqueValues(filteredProducts, "price");
  const specificColors = getSpecificColors(filteredProducts, "specificColor");
  const viewOutFits = [1, 2, 3, 4];

  let checkImage = 0;

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleFilterOutfits = (e) => {
    // Convert the selected value to a number and update `viewOutfits`
    const selectedOutfits = Number(e.target.value);

    // Update only the `viewOutfits` field in the `filters` state
    setFilters((prevFilters) => ({
      ...prevFilters, // Spread previous filter values
      viewOutfits: selectedOutfits, // Update viewOutfits
    }));
  };
  const clearFilters = () => {
    setFilters({
      color: "",
      material: "",
      type: "",
      name: "",
      price: "",
      stats: "",
      search: "",
      dresstype: "",
      specificColor: "",
      viewOutfits: 4,
    });
  };
  const clearCarts = () => {
    setSelectedProducts([]);
  };

  const detailFilter = (product) => {
    setDetailProduct(product);
    setShowDetailsPopUp(true);
    setOpen(true);
  };

  const toggleSelectProduct = (product) => {
    setSelectedProducts((prev) =>
      prev.find((p) => p.dressId === product.dressId)
        ? prev.filter((p) => p.dressId !== product.dressId)
        : [...prev, product]
    );
    const selectedTime = new Date().toLocaleString([], {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    setOldSuggestedArray((prev) => {
      const isProductSelected = prev.some(
        (item) => item.dressId === product.dressId
      );

      if (isProductSelected) {
        // If the product is already selected, remove it (unselect)
        return prev.filter((item) => item.dressId !== product.dressId);
      } else {
        // If the product is not selected, add it with the selectedTime
        return [...prev, { ...product, selectedTime }];
      }
    });
  };

  const getSelectedFiltersCount = () => {
    const counts = {};
    const hasFilters = Object.values(filters).some((value) => value); // Check if any filters are active

    if (!hasFilters) {
      return { total: products.length };
    }

    filteredProducts.forEach((product) => {
      // Check for color match
      if (filters.color) {
        const colors = product.color.split("/").map((c) => c.trim()); // Split product color by '/'
        if (colors.includes(filters.color)) {
          counts[filters.color] = (counts[filters.color] || 0) + 1;
        }
      }

      // Check for specific color match
      if (filters.specificColor) {
        if (product.color === filters.specificColor) {
          counts[filters.specificColor] =
            (counts[filters.specificColor] || 0) + 1;
        }
      }

      // Check for other filters (material, dresstype, etc.)
      for (const key in filters) {
        if (
          key !== "color" &&
          key !== "specificColor" &&
          filters[key] &&
          product[key] === filters[key]
        ) {
          counts[filters[key]] = (counts[filters[key]] || 0) + 1;
        }
      }
    });

    return counts;
  };

  const selectedFiltersCount = getSelectedFiltersCount();

  return (
    <>
      <Wrapper isNightMode={isNightMode}>
        {/* Filter Section */}
        <Container fluid>
          <Row>
            <Col lg={9}>
              {Object.keys(selectedFiltersCount).length > 0 ? (
                <SelectedFilters>
                  {Object.entries(selectedFiltersCount).map(
                    ([filter, count]) => (
                      <SelectedFilterItem key={filter}>
                        {filter}: {count} items
                      </SelectedFilterItem>
                    )
                  )}
                </SelectedFilters>
              ) : (
                <p>No filters applied. Total items: {products.length}</p>
              )}
              <FilterContainer isNightMode={isNightMode}>
                <FilterOptions>
                  <FilterIconDiv>
                    <CheckboxLabel>Filters</CheckboxLabel>
                    <TiArrowSortedDown />
                  </FilterIconDiv>
                  <FilterSubDiv>
                    <SelectLabel>
                      <span>Color</span>
                      <Select
                        name="color"
                        onChange={handleFilterChange}
                        value={filters.color}
                      >
                        <option value="">All Colors</option>
                        {uniqueColors.map((color) => (
                          <option key={color} value={color}>
                            {color}
                          </option>
                        ))}
                      </Select>
                    </SelectLabel>
                    <SelectLabel>
                      <span>Specific Color</span>
                      <Select
                        name="specificColor"
                        onChange={handleFilterChange}
                        value={filters.specificColor}
                      >
                        <option value="">All Specific Colors</option>
                        {specificColors.map((specificColor) => (
                          <option key={specificColor} value={specificColor}>
                            {specificColor}
                          </option>
                        ))}
                      </Select>
                    </SelectLabel>
                    <SelectLabel>
                      <span>Material</span>
                      <Select
                        name="material"
                        onChange={handleFilterChange}
                        value={filters.material}
                      >
                        <option value="">All Materials</option>

                        {uniqueMaterials.map((material) => (
                          <option key={material} value={material}>
                            {material}
                          </option>
                        ))}
                      </Select>
                    </SelectLabel>
                    <SelectLabel>
                      <span>Type</span>
                      <Select
                        name="dresstype"
                        onChange={handleFilterChange}
                        value={filters.dresstype}
                      >
                        <option value="">All Types</option>
                        {uniqueTypes.map((dresstype) => (
                          <option key={dresstype} value={dresstype}>
                            {dresstype}
                          </option>
                        ))}
                      </Select>
                    </SelectLabel>
                    <SelectLabel>
                      <span>Brand</span>
                      <Select
                        name="name"
                        onChange={handleFilterChange}
                        value={filters.name}
                      >
                        <option value="">All Brands</option>
                        {uniqueBrands.map((name) => (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        ))}
                      </Select>
                    </SelectLabel>
                    <SelectLabel>
                      <span>Price</span>
                      <Select
                        name="price"
                        onChange={handleFilterChange}
                        value={filters.price}
                      >
                        <option value="">All Prices</option>
                        {uniquePrices.map((price) => (
                          <option key={price} value={price}>
                            {price}
                          </option>
                        ))}
                      </Select>
                    </SelectLabel>
                    <SelectLabel>
                      <span>View Outfits</span>
                      <Select
                        name="price"
                        onChange={handleFilterOutfits}
                        value={filters.viewOutfits}
                      >
                        {viewOutFits.map((total) => (
                          <option key={total} value={total}>
                            {total}
                          </option>
                        ))}
                      </Select>
                    </SelectLabel>
                    <SelectLabel>
                      <span>Sort By</span>
                      <Select
                        name="stats"
                        onChange={handleFilterChange}
                        value={filters.stats}
                      >
                        <option value="old-new">Old-New</option>
                        <option value="new-old">New-Old</option>
                        <option value="brand-a-z">Brand A-Z</option>
                        <option value="brand-z-a">Brand Z-A</option>
                        <option value="least-recently-worn">
                          Least Recently Worn
                        </option>
                        <option value="most-recently-worn">
                          Most Recently Worn
                        </option>
                        <option value="least-included-fits">
                          Least Included in Fits
                        </option>
                        <option value="most-included-fits">
                          Most Included in Fits
                        </option>
                      </Select>
                    </SelectLabel>
                    <OldSuggestedButton
                      onClick={() => {
                        setOpenOldSuggestedPopup(true);
                      }}
                    >
                      Old Suggested Outfits
                    </OldSuggestedButton>
                  </FilterSubDiv>

                  <ApplyButton isNightMode={isNightMode} onClick={clearFilters}>
                    Clear Filters
                  </ApplyButton>
                </FilterOptions>
              </FilterContainer>
              <Spacer />
              <SearchBar
                type="text"
                placeholder="Search by keyword..."
                name="search"
                onChange={handleFilterChange}
                value={filters.search}
              />
              {/* Product Grid */}
              <Spacer />
              <CustomContainer isNightMode={isNightMode} >
                <ProductGrid viewTotal={filters.viewOutfits}>
                  {filteredProducts.map((product, index) => {
                    return (
                      <MainProductDiv>
                        <ProductName>{product.name}</ProductName>
                        <ProductItem
                          key={product?.dressId}
                          onClick={() => toggleSelectProduct(product)}
                        >
                          <Checkmark
                            selected={selectedProducts.some(
                              (p) => p.dressId === product.dressId
                            )}
                          />

                          <ProductImage
                            src={product.url}
                            alt={product.url}
                            viewTotal={filters.viewOutfits}
                            onError={() => handleBrokenImage(product.dressId)}
                          />
                        </ProductItem>
                        <Icons>
                          <DetailsIcon
                            onClick={() => detailFilter(product)}
                            title="View Details"
                          >
                            <CustomMagnifyingGlass />
                          </DetailsIcon>
                          {brokenImages.includes(product.dressId) && (
                            <CustomCiEdit
                              onClick={() => {
                                handleBrokenImageFunction(product);
                              }}
                            /> // Only show for broken images
                          )}
                        </Icons>

                        {/* {!product.inMyDrsrr && (
                          <Rating
                            rating={productRatings[product.dressId] || 0}
                            onRate={(newRating) =>
                              handleRating(product.dressId, newRating)
                            }
                          />
                        )} */}
                      </MainProductDiv>
                    );
                  })}
                </ProductGrid>
              </CustomContainer>
            </Col>

            {/* Sidebar */}
            <Col lg={3} md={12}>
              <Sidebar isNightMode={isNightMode}>
                <h3>Selected Items</h3>
                {selectedProducts.map((product) => (
                  <SidebarItem key={product.id}>
                    <SidebarImage isNightMode={isNightMode} src={product.url} alt={product.name} />

                    <RemoveButton isNightMode={isNightMode} onClick={() => toggleSelectProduct(product)}>
                      ✖
                    </RemoveButton>
                  </SidebarItem>
                ))}
                <NotesInput placeholder="Add notes..." />
                <SendButton onClick={handleSendToMobile}>Send to Mobile App</SendButton>
                <ApplyButtonSideBar isNightMode={isNightMode} onClick={clearCarts}>
                  Clear Cart
                </ApplyButtonSideBar>
              </Sidebar>
            </Col>
          </Row>
        </Container>
      </Wrapper>
      {open && (
        <DetailsPopup
          closeModal={closeModal}
          open={open}
          detailProduct={detailProduct}
          brokenImageProduct={brokenImageProduct}
          setProducts={setProducts}
          setShowEditImagePoUp={setShowEditImagePoUp}
          showEditImagePopUp={showEditImagePopUp}
          setShowDetailsPopUp={setShowDetailsPopUp}
          showDetailsPopUp={showDetailsPopUp}
          isNightMode={isNightMode}
        />
      )}
      {openOldSuggestedPopup && (
        <OldSuggestedOutfits
          //oldSuggestedArray={oldSuggestedArray}
          openOldSuggestedPopup={openOldSuggestedPopup}
          oldSuggestedArray={finalizedSuggestedArray}
          closeModalOldSuggestedOutfits={closeModalOldSuggestedOutfits}
          setOldSuggestedArray={setOldSuggestedArray}
          isNightMode={isNightMode}
        />
      )}
    </>
  );
};

const CustomGrCheckboxSelected = styled(FaCircleCheck)`
  height: 30px;
  width: 30px;
`;
const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;

const CustomMagnifyingGlass = styled(LiaSearchSolid)`
  height: 25px;
  width: 25px;
  text-align: center;
`;

const CustomCiEdit = styled(CiEdit)`
  height: 25px;
  width: 25px;
  text-align: center;
  position: relative;
  top: -7px;
  cursor: pointer;
`;

const FilterIconDiv = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
`;

const FilterSubDiv = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
`;

const ApplyButtonSideBar = styled.button`
  background-color: ${({ isNightMode }) => (isNightMode ? "#ffffff" : "#121212")};
  color: ${({ isNightMode }) => (isNightMode ? "#121212" : "#fff")};
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 10px;
  align-self: flex-end;
  margin-left: 4px;
  width: 100%;

  &:hover {
    background-color: #555;
    color: #ffffff;
  }
`;
const SideBarSub = styled.div``;

const Icons = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const DetailsIcon = styled.div`
  background: linear-gradient(135deg, #ff6f91, #ff2b86); /* Pink gradient */
  color: #fff;
  padding: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  width: 30px; /* Adjust icon container size */
  height: 30px;
  position: relative; /* Position it inside the item square */
  bottom: 10px; /* Adjust position inside the square */
  left: 85px;
  // z-index: 10;

  &:hover {
    background: linear-gradient(
      135deg,
      #ff5a8d,
      #ff1f78
    ); /* Lighter pink on hover */
    //transform: scale(1.1);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: scale(0.95);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  svg {
    font-size: 24px; /* Adjust icon size */
  }
`;

const MainProductDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;
// const ProductItem = styled.div`
//   text-align: center;
//   cursor: pointer;
//   display: flex;
//   justify-content: center;
//   align-content: center;
//   flex-direction: column;
// `;

const Checkmark = styled(FaCircleCheck)`
  position: absolute; /* Checkmark will position itself relative to the ProductItem */
  top: 10px; /* Position it 10px from the top of the ProductItem */
  right: 10px; /* Position it 10px from the right edge of ProductItem */
  color: black;
  font-size: 24px;
  display: ${({ selected }) => (selected ? "block" : "none")};
`;

const ProductName = styled.p`
  margin-top: 10px;
`;

const SidebarItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
`;

const SidebarImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: fill;
`;

const SidebarName = styled.p`
  margin-top: 10px;
`;

const RemoveButton = styled.button`
  background-color: transparent;
  color: ${({ isNightMode }) => (isNightMode ? "#ffffff" : "#121212")};
  border: none;
  cursor: pointer;
  font-size: 24px;
`;

const SelectLabel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Select = styled.select`
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100px;
`;

const ClearButton = styled.button``;

const SelectedFilters = styled.div`
  margin-bottom: 10px;
  font-weight: bold;
`;

const SelectedFilterItem = styled.div`
  margin-bottom: 5px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  background-color: ${({ isNightMode }) => (isNightMode ? "#737373" : "#f7f8fc")}; /* Light background for contrast */
`;

const CustomContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 20px;
  background-color: ${({ isNightMode }) => (isNightMode ? "#3C3C40" : "#fff")};
`;

const FilterContainer = styled.div`
  margin-bottom: 20px;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 15px;
  background-color: ${({ isNightMode }) => (isNightMode ? "#3C3C40" : "#fff")};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05); /* Subtle shadow */
`;

const FilterOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ApplyButton = styled.button`
  background-color: ${({ isNightMode }) => (isNightMode ? "#ffffff" : "#333")};
  color: ${({ isNightMode }) => (isNightMode ? "#121212" : "#fff")};
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  align-self: flex-end;
  transition: all 0.3s ease;

  &:hover {
    background-color: #555;
    color: #fff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const OldSuggestedButton = styled.button`
  background-color: #d13bff;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  align-self: flex-end;
  transition: all 0.3s ease;

  &:hover {
    background-color: #b129d1;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(${(props) => props.viewTotal}, 1fr);
  gap: 2px;
  flex: 3;
  padding: 10px; /* Padding for better spacing */
`;

const ProductItem = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  padding: 1px; /* Consistent padding */
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.05); /* Slight scale effect */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow */
  }
`;

const ProductImage = styled.img`
  width: ${({ viewTotal }) =>
    viewTotal === 1 ? "300px" : viewTotal === 2 ? "300px" : "200px"};
  height: ${({ viewTotal }) =>
    viewTotal === 1 ? "300px" : viewTotal === 2 ? "300px" : "200px"};
  object-fit: cover;
  border-radius: 8px; /* Rounded corners for a modern look */
`;

const Sidebar = styled.div`
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 12px;
  max-height: 80vh;
  overflow-y: auto;
  position: sticky;
  top: 20px;
  background-color: ${({ isNightMode }) => (isNightMode ? "#3C3C40" : "#ffffff")};
  color: ${({ isNightMode }) => (isNightMode ? "#ffffff" : "#3C3C40")};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
`;

const NotesInput = styled.textarea`
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #ddd;
  resize: none;
  box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:focus {
    border-color: #999;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
  }
`;

const SearchBar = styled.input`
  width: 100%;
  padding: 12px 18px;
  font-size: 16px;
  border-radius: 30px;
  border: 1px solid #ddd;
  background-color: #f1f1f1;
  color: #333;
  outline: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:focus {
    border-color: #bbb;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }

  &::placeholder {
    color: #999;
  }
`;

const SendButton = styled.button`
  background-color: #d13bff;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 10px;
  width: 100%;
  transition: all 0.3s ease;

  &:hover {
    background-color: #b129d1;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const Spacer = styled.div`
  margin-top: 1.5rem;
`;


export default ClosetApp;
