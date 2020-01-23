var cars = new Array(10);
var customers = new Array(cars.length);
var resorts = new Array(cars.length);

var storageCarIndex = 0;
var storageApartmentIndex = 0;

var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        for (let i = 0; i < cars.length; i++) {
            cars[i] = { Manufacturer: "Car" + i, Model: "Model", Rate: 10 * i }
            customers[i] = { FirstName: "Person" + i, LastName: "Last" }
            resorts[i] = { Resort: "Resort" + i, Rate: 100 * i }
        }
        //Creates the table from where to choose a car and inserts the header
        {
            let table = document.getElementById("carPageTable");
            let header = table.createTHead();
            let row = header.insertRow(0);
            let cell = row.insertCell(0);
            cell.innerHTML = "Manufacturer";
            cell = row.insertCell(1);
            cell.innerHTML = "Model";
            cell = row.insertCell(2);
            cell.innerHTML = "Daily rate";
        }
        //Creates the table from where to choose a customer and inserts the header
        {
            let table = document.getElementById("carPageCustomerTable");
            let header = table.createTHead();
            let row = header.insertRow(0);
            let cell = row.insertCell(0);
            cell.innerHTML = "Last Name";
            cell = row.insertCell(1);
            cell.innerHTML = "First Name";
        }
        //Creates the table from where to choose a customer and inserts the header
        {
            let table = document.getElementById("apartmentPageTable");
            let header = table.createTHead();
            let row = header.insertRow(0);
            let cell = row.insertCell(0);
            cell.innerHTML = "Resort";
            cell = row.insertCell(1);
            cell.innerHTML = "Daily rate";
        }
        //Creates the table from where to choose a customer and inserts the header
        {
            let table = document.getElementById("apartmentPageCustomerTable");
            let header = table.createTHead();
            let row = header.insertRow(0);
            let cell = row.insertCell(0);
            cell.innerHTML = "Last Name";
            cell = row.insertCell(1);
            cell.innerHTML = "First Name";
        }
        {
            let table = document.getElementById("carReservationsPageTable");
            let header = table.createTHead();
            let row = header.insertRow(0);
            let cell = row.insertCell(0);
            cell.innerHTML = "ID";
            cell = row.insertCell(1);
            cell.innerHTML = "Content";
        }
        app.checkForStorage = function () {
            if (localStorage['carReservation']) {
                app.storageLoad('car');
            } else {
                //$ul.html(notesHdr + noNotes).listview('refresh'); 
            }
        }
        /*app.checkForStorage = function () {
            if (localStorage['ApartmentReservation']) {
                app.storageLoad();
            } else {
                //$ul.html(notesHdr + noNotes).listview('refresh');
            }
        }*/
        app.storageAdd = function (title, content, storagespace) {
            let storage = localStorage[storagespace + "Reservation"];
            let storageObj;

            if (storage == undefined || storage == '') {
                storageObj = {};
            }
            else {
                storageObj = JSON.parse(storage);
            }

            storageObj[title] = content;
            //storage[storagecarIndex]=storageObj;
            localStorage[storagespace + "Reservation"] = JSON.stringify(storageObj);
        }
        app.storageGet = function (storagespace) {
            // get notes
            let storages = localStorage[storagespace + "Reservation"];
            // convert notes from string to object
            return JSON.parse(storages);
        }
        app.storageLoad = function (storagespace) {
            let storageObj = app.storageGet(storagespace);

            $("#" + storagespace + "ReservationsPageTable tbody tr").remove();
            let table = document.getElementById(storagespace + "ReservationsPageTable");
            let body = table.createTBody();
            for (let i = 0; storageObj[i] != null; i++) {
                let row = body.insertRow(i);
                let cell = row.insertCell(0);
                cell.innerHTML = i;
                cell = row.insertCell(1);
                cell.innerHTML = storageObj[i].car + " " + storageObj[i].customer;
                storageCarIndex = i + 1;
            }
            $('#' + storagespace + 'ReservationsPageTable').DataTable();
        }
    },

    onDeviceReady: function () {
        app.checkForStorage();

        //#region Car page functions
        //On click event for the button on the "home" page
        $("#carReservationButton").on("click", function () {
            $.mobile.changePage("#carReservationPage");

            //Inserts the data from the global arrays into the tables
            $("#carPageTable tbody tr").remove();
            $("#carPageTable tbody").remove();
            $("#carPageCustomerTable tbody tr").remove();
            $("#carPageCustomerTable tbody").remove();

            let table = document.getElementById("carPageTable");
            let body = table.createTBody();
            for (let i = 0; i < cars.length; i++) {
                let row = body.insertRow(i);
                let cell = row.insertCell(0);
                cell.innerHTML = cars[i].Manufacturer;
                cell = row.insertCell(1);
                cell.innerHTML = cars[i].Model;
                cell = row.insertCell(2);
                cell.innerHTML = cars[i].Rate;
            }
            $('#carPageTable').DataTable();
            table = document.getElementById("carPageCustomerTable");
            body = table.createTBody();
            for (let i = 0; i < customers.length; i++) {
                let row = body.insertRow(i);
                let cell = row.insertCell(0);
                cell.innerHTML = customers[i].LastName;
                cell = row.insertCell(1);
                cell.innerHTML = customers[i].FirstName;
            }
            $('#carPageCustomerTable').DataTable();

        });
        //On click event for the "Click to select car" in the car reservation page
        $("#carPageCar").on("click", function () {
            $("#carPageTable tbody").off('click', 'tr');
            //On click event for the table to select a row
            $('#carPageTable tbody').on('click', 'tr', function () {
                var carTable = $('#carPageTable').DataTable();

                if ($(this).hasClass('selected')) {
                    $(this).removeClass('selected');
                }
                else {
                    carTable.$('tr.selected').removeClass('selected');
                    $(this).addClass('selected');
                    var ids = $.map(carTable.rows('.selected').data(), function (item) {
                        return item[0] + " " + item[1];
                    });
                    document.getElementById("carPageCar").value = ids;
                }
            });

            $.mobile.changePage("#carPage");
        });
        //On click event for the "Confirm" button in the Choose car window
        $("#carPageCarBack").on("click", function () {
            $("#carPageTable tbody").off('click', 'tr');
            $.mobile.changePage("#carReservationPage");
        });
        //On click event for the "Click to select customer" in the car reservation page
        $("#carPageCustomer").on("click", function () {
            $("#carPageTable tbody").off('click', 'tr');
            //On click event for the table to select a row
            $('#carPageCustomerTable tbody').on('click', 'tr', function () {
                var carCustomerTable = $('#carPageCustomerTable').DataTable();

                if ($(this).hasClass('selected')) {
                    $(this).removeClass('selected');
                }
                else {
                    carCustomerTable.$('tr.selected').removeClass('selected');
                    $(this).addClass('selected');
                    var ids = $.map(carCustomerTable.rows('.selected').data(), function (item) {
                        return item[0] + " " + item[1];
                    });
                    document.getElementById("carPageCustomer").value = ids;
                }
            });
            $.mobile.changePage("#carCustomerPage");
        });
        //On click event for the "Confirm" button in the Choose customer window
        $("#carPageCustomerBack").on("click", function () {
            $("#carPageCustomerTable tbody").off('click', 'tr');
            $.mobile.changePage("#carReservationPage");
        });
        //On click event for the submit button
        $("#carPageButtonSubmit").on("click", function () {
            if (Date.parse($("#carPageDateFrom").val()) &&
                Date.parse($("#carPageDateTo").val()) &&
                ($("#carPageCar").val() != "") &&
                ($("#carPageCustomer").val() != "") &&
                ($("#carPageMileage").val() !== "")) {
                let content = {
                    dateFrom: $("#carPageDateFrom").val(), dateTo: $("#carPageDateTo").val(),
                    car: $("#carPageCar").val(), customer: $("#carPageCustomer").val(), mileage: $("#carPageMileage").val()
                }
                app.storageAdd(storageCarIndex, content, "car");
                alert("Thank you!");
                $("#carPageTable tbody").off('click', 'tr');
                $("#carPageTable tbody").empty();
                $.mobile.changePage("#mainPage");
            }
            else {
                alert("Submit failed");
            }
        });



        //#endregion End of car page functions

        //#region Apartment page functions
        //On click event for the button on the "home" page
        $("#apartmentReservationButton").on("click", function () {
            $.mobile.changePage("#apartmentReservationPage");

            //Inserts the data from the global arrays into the tables
            let table = document.getElementById("apartmentPageTable");
            $("#apartmentPageTable tbody tr").remove();
            $("#apartmentPageCustomerTable tbody tr").remove();
            let body = table.createTBody();
            for (let i = 0; i < resorts.length; i++) {
                let row = body.insertRow(i);
                let cell = row.insertCell(0);
                cell.innerHTML = resorts[i].Resort;
                cell = row.insertCell(1);
                cell.innerHTML = resorts[i].Rate;
            }
            $('#apartmentPageTable').DataTable();
            //Inserts the data from the global arrays into the tables
            table = document.getElementById("apartmentPageCustomerTable");
            body = table.createTBody();
            for (let i = 0; i < customers.length; i++) {
                let row = body.insertRow(i);
                let cell = row.insertCell(0);
                cell.innerHTML = customers[i].LastName;
                cell = row.insertCell(1);
                cell.innerHTML = customers[i].FirstName;
            }
            $('#apartmentPageCustomerTable').DataTable();
        });
        //On click event for the "Click to select apartment" in the apartment reservation page
        $("#apartmentPageApartment").on("click", function () {
            //On click event for the table to select a row
            $('#apartmentPageTable tbody').on('click', 'tr', function () {
                var apartmentTable = $('#apartmentPageTable').DataTable();

                if ($(this).hasClass('selected')) {
                    $(this).removeClass('selected');
                }
                else {
                    apartmentTable.$('tr.selected').removeClass('selected');
                    $(this).addClass('selected');
                    var ids = $.map(apartmentTable.rows('.selected').data(), function (item) {
                        return item[0] + " " + item[1];
                    });
                    document.getElementById("apartmentPageApartment").value = ids;
                }
            });

            $.mobile.changePage("#apartmentPage");
        });
        $("#apartmentPageCustomer").on("click", function () {
            //On click event for the table to select a row
            $('#apartmentPageCustomerTable tbody').on('click', 'tr', function () {
                var apartmentCustomerTable = $('#apartmentPageCustomerTable').DataTable();

                if ($(this).hasClass('selected')) {
                    $(this).removeClass('selected');
                }
                else {
                    apartmentCustomerTable.$('tr.selected').removeClass('selected');
                    $(this).addClass('selected');
                    var ids = $.map(apartmentCustomerTable.rows('.selected').data(), function (item) {
                        return item[0] + " " + item[1];
                    });
                    document.getElementById("apartmentPageCustomer").value = ids;
                }
            });
            $.mobile.changePage("#apartmentCustomerPage");
        });
        $("#apartmentPageBack").on("click", function () {
            $("#apartmentPageCustomerTable tbody").off('click', 'tr');
            $.mobile.changePage("#apartmentReservationPage");
        });
        $("#apartmentPageCustomerBack").on("click", function () {
            $("#apartmentPageCustomerTable tbody").off('click', 'tr');
            $.mobile.changePage("#apartmentReservationPage");
        });
        $("#apartmentPageButtonSubmit").on("click", function () {
            /* save here*/
            alert("Thank you!");
        });
        //#endregion End of apartment page functions

        $("#carReservationsButton").on("click", function () {
            app.storageLoad("car");
            $.mobile.changePage("#carReservationsPage");
        });
        $("#carReservationsPageBack").on("click", function () {
            $.mobile.changePage("#mainPage");
        });


        let trigged = false;

        if (trigged == false) {
            trigged = true;
            // Application initialize for jQuery, after cordova is ready    
            $(document).ready(function () {

            });
            console.log('Triggered');
        }
    },

    goBack: function () {
        if ($.mobile.activePage[0].id === "contactDetailPage" || $.mobile.activePage[0].id === "addDetailPage") {
            $.mobile.changePage($("#mainPage"));
        }
        else {
            navigator.app.exitApp();
        }
        // Stop the normal link
        return false;
    },
};

app.initialize();