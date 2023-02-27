const dataSection = document.querySelector("#dataSection");
const selectUser = document.querySelector("#selectUser");
const pageButtonContainer = document.querySelector("#page-button-container");
const pageNumberContainer = document.querySelector("#page-number-container");
const fragment = document.createDocumentFragment();

//event listeners
document.addEventListener("click", ({ target }) => {
  if (target.matches(".page-button")) {
    const page = target.id;
    printAll(null, page);
  }
});

selectUser.addEventListener("change", ({ target }) => {
  const id = target.value;
  printOne(id);
});

//Get user data with fetch
const getData = async (id, page = 1) => {
  try {
    let request;
    if (!id) {
      request = await fetch(`https://reqres.in/api/users?page=${page}`);
    } else {
      request = await fetch(`https://reqres.in/api/users/${id}`);
    }
    if (request.ok) {
      const resp = await request.json();
      return { ok: true, resp };
    } else {
      throw {
        ok: false,
        msg: "request error",
      };
    }
  } catch (error) {
    return error;
  }
};
//make page buttons
const makePageButtons = async () => {
  const userData = await getData();
  const numOfPages = userData.resp.total_pages;
  for (let i = 1; i <= numOfPages; i++) {
    const pageNumberButton = document.createElement("BUTTON");
    pageNumberButton.textContent = `Page ${i}`;
    pageNumberButton.classList.add("page-button");
    pageNumberButton.setAttribute("id", i);
    fragment.append(pageNumberButton);
  }
  pageButtonContainer.append(fragment);
  makeSelect(numOfPages);
};

//make select options using user emails by retrieving user data from getDAta
const makeSelect = async (numOfPages) => {
  let allUserData = [];
  for (let i = 1; i <= numOfPages; i++) {
    const userData = await getData(null, i);
    allUserData.push(...userData.resp.data);
  }
  allUserData.forEach((item, i) => {
    const option = document.createElement("OPTION");
    option.textContent = item.email;
    option.setAttribute("value", i);
    fragment.append(option);
  });
  selectUser.append(fragment);
};

//print all users, page1 or page2, retrieving data from getDAta
const printAll = async (id, page) => {
  dataSection.innerHTML = "";
  pageNumberContainer.innerHTML = "";
  let requestData;
  requestData = await getData(id, page);
  const pageNumber = requestData.resp.page;
  arrayUserData = requestData.resp.data;
  let nameHeading = document.createElement("H4");
  nameHeading.textContent = "Name";
  let surnameHeading = document.createElement("H4");
  surnameHeading.textContent = "Surname";
  let emailHeading = document.createElement("H4");
  emailHeading.textContent = "Email";
  let avatarHeading = document.createElement("H4");
  avatarHeading.textContent = "Photo";
  arrayUserData.forEach((item) => {
    const namePara = document.createElement("P");
    namePara.textContent = item.first_name;
    const surnamePara = document.createElement("P");
    surnamePara.textContent = item.last_name;
    const emailPara = document.createElement("P");
    emailPara.textContent = item.email;
    const avatarImg = document.createElement("IMG");
    avatarImg.src = item.avatar;
    fragment.append(namePara, surnamePara, emailPara, avatarImg);
  });
  dataSection.append(
    nameHeading,
    surnameHeading,
    emailHeading,
    avatarHeading,
    fragment
  );
  const pageNumberPara = document.createElement("P");
  pageNumberPara.textContent = `Page ${pageNumber}`;
  pageNumberContainer.append(pageNumberPara);
};

//print only selected user
const printOne = async (id) => {
  dataSection.innerHTML = "";
  let requestData;
  requestData = await getData(id);
  userDataObj = requestData.resp.data;
  //make headings
  let nameHeading = document.createElement("H4");
  nameHeading.textContent = "Name";
  let surnameHeading = document.createElement("H4");
  surnameHeading.textContent = "Surname";
  let emailHeading = document.createElement("H4");
  emailHeading.textContent = "Email";
  let avatarHeading = document.createElement("H4");
  avatarHeading.textContent = "Photo";
  //user data
  const namePara = document.createElement("P");
  namePara.textContent = userDataObj.first_name;
  const surnamePara = document.createElement("P");
  surnamePara.textContent = userDataObj.last_name;
  const emailPara = document.createElement("P");
  emailPara.textContent = userDataObj.email;
  const avatarImg = document.createElement("IMG");
  avatarImg.src = userDataObj.avatar;
  dataSection.append(
    nameHeading,
    surnameHeading,
    emailHeading,
    avatarHeading,
    namePara,
    surnamePara,
    emailPara,
    avatarImg
  );
};
//call functions
makePageButtons();
//makeSelect();
printAll();
