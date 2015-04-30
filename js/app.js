'use strict';

// questions text and links to the next question or eligibility state
var ELIGIBILITY_FLOW = [
    {   // Question 0
        question: "Do you have a case pending?",
        yes: {
            text: "Yes",
            next: "ineligible at this time"
        },
        no: {
            text: "No",
            next: 1
        }
    },
    {   // Question 1
        question: "Are you sealing a conviction or a non-conviction?",
        yes: {
            text: "Conviction",
            next: 2
        },
        no: {
            text: "Non-conviction",
            next: 5
        }
    },
    {   // Question 2
        question: "Is this an eligible misdemeanor/felony or an ineligible misdemeanor/felony?",
        yes: {
            text: "Eligible misdemeanor or felony",
            next: 3
        }, 
        no: {
            text: "Ineligible misdemeanor or felony",
            next: "ineligible"
        }
    },
    {   // Question 3
        question: "Have you subsequently been convicted of another crime in any jurisdiction?",
        yes: {
            text: "Yes",
            next: "ineligible"
        },
        no: {
            text: "No",
            next: 4
        }
    },
    {   // Question 4
        question: "Has it been 8 years since you were off papers?",
        yes: {
            text: "Yes",
            next: "eligable"
        },
        no: {
            text: "No",
            next: "ineligible at this time"
        }
    },
    {   // Question 5
        question: "Is your non-conviction the result of a Deferred Sentencing Agreement?",
        yes: {
            text: "Yes",
            next: 7
        },
        no: {
            text: "No",
            next: 6
        }
    },
    {   // Question 6
        question: "Do you also have an ineligible conviction on your record?",
        yes: {
            text: "Yes",
            next: 13
        },
        no: {
            text: "No",
            next: 8
        }
    },
    {   // Question 7
        question: "Do you also have an ineligible conviction on your record?",
        yes: {
            text: "Yes",
            next: "ineligible"
        },
        no: {
            text: "No",
            next: 8
        }
    },
    {   // Question 8
        question: "Is the non-conviction for an eligible misdemeanor or an ineligible misdemeanor/felony?",
        yes: {
            text: "Eligible misdemeanor/felony",
            next: 12 
        },
        no: {
            text: "Ineligible misdemeanor/felony",
            next: 9
        }
    },
    {   // Question 9
        question: "Was the case terminated before charging by the prosectution (no papered)?",
        yes: {
            text: "Yes",
            next: 11
        },
        no: {
            text: "No",
            next: 10
        }
    },
    {   // Question 10
        question: "Has it been 4 years since you were \"off papers\" for the felony non-conviction?",
        yes: {
            text: "Yes",
            next: "eligable"
        },
        no: {
            text: "No",
            next: "ineligible at this time"
        }
    },
    {   // Question 11
        question: "Has it been 3 years since you were \"off papers\" for the felony non-conviction?",
        yes: {
            text: "Yes",
            next: "eligable"
        },
        no: {
            text: "No",
            next: "ineligible at this time" 
        }
    },
    {   // Question 12
        question: "Has it been two years since you were \"off papers\" for the misdemeanor non-conviction?",
        yes: {
            text: "Yes",
            next: "eligable"
        },
        no: {
            text: "No",
            next: "ineligible at this time" 
        }
    },
    {   // Question 13
        question: "Is the ineligible conviction for a felony or misdemeanor?",
        yes: {
            text: "Felony",
            next: 14 
        },
        no: {
            text: "Misdemeanor",
            next: 15
        }
    },
    {   // Question 14
        question: "Has it been 10 years since you were \"off papers\" for the misdemeanor conviction?",
        yes: {
            text: "Yes",
            next: 8
        },
        no: {
            text: "No",
            next: "ineligible at this time" 
        }
    },
    {   // Question 15
        question: "Has it been 5 years since you were \"off papers\" for the misdemeanor conviction?",
        yes: {
            text: "Yes",
            next: 8 
        },
        no: {
            text: "No",
            next: "ineligible at this time"
        }
    },
];


// App definition + dependencies
var myApp = angular.module('myApp', [
    // necessary for matching the URL to an available resource
    'ngRoute',
    // Material Design by Google
    'ngMaterial'
    ]);

// Route definition 
myApp.config(['$routeProvider',
    function ($routeProvider) {
        
        $routeProvider
            // Homepage includes Expunge D.C. overview and link to the wizard
            .when('/', {
                templateUrl: 'views/home.html',
                controller: 'homeController'
            })
            // Information on an misdemeanor or felony being ineligible for expungement, either temporarily or permanently 
            .when('/eligibility-check/ineligible/:reason?', {
                templateUrl: 'views/eligibility-check-ineligible.html',
                controller: 'eligibilityIneligibleController'
            })
            // Information on an misdemeanor or felony being eligible for expungement, including next steps
            .when('/eligibility-check/eligible', {
                templateUrl: 'views/eligibility-check-eligible.html',
                controller: 'eligibilityEligibleController'
            })
            // The wizard!
            .when('/eligibility-check', {
                templateUrl: 'views/eligibility-checker.html',
                controller: 'EligibilityWizardController as eligibilityCtrl'
            })
            // FAQs
            .when('/questions', {
                templateUrl: 'views/questions.html',
                controller: 'questionsController'
            })
            // FAQs
            .when('/legal-aid', {
                templateUrl: 'views/legal-aid.html',
                controller: 'legalAidController'
            })
            // If the user attempts to visit a route that doesn't match any of the patterns above, re-direct them to the homepage
            .otherwise({
                redirectTo: '/'
            });
}]);


// Homepage controller
myApp.controller('homeController',
    ['$scope', 
        function ($scope) {
            

        }
]);

// FAQs controller
myApp.controller('questionsController',
    ['$scope', 
        function ($scope) {
            

        }
]);

// Legal Aid controller
myApp.controller('legalAidController',
    ['$scope', 
        function ($scope) {
            

        }
]);

// refactored version of Eligibility Checker Controller --AKA The Wizard
myApp.controller('EligibilityWizardController', function() {
    // a number indicating the current step the user is on -- until they reach an eligibility state.
    // Once eligibility state is reached, currentStep will hold a string indicating the eligiblity.
    this.currentStep = 0;
    // history holds the user's answers to previous questions to be returned when eligibility is known
    this.history = [];

    this.eligibilityKnown = function() {
        // if current step is a number we are still on questions
        // if current step is a string (ie "eligible" or "ineligible"), the eligiblity state is known
        return (typeof this.currentStep === "string") ; 
    }

    this.currentQuestion = function() {
        // send back an empty string if currentQuestion is called and eligibility is known
        if (this.eligibilityKnown())
            return "";
        if (this.currentStep < ELIGIBILITY_FLOW.length);
            return ELIGIBILITY_FLOW[this.currentStep].question;
        // else if there is no question cooresponding to currentStep
        throw new Error("There is no question number " + this.currentStep);
    }

    this.yesText = function() {
        // send back an empty string if yesText is called and eligibility is known
        if (this.eligibilityKnown())
            return "";
        if (this.currentStep < ELIGIBILITY_FLOW.length);
            return ELIGIBILITY_FLOW[this.currentStep].yes.text;
        // else if there is no question cooresponding to currentStep
        throw new Error("There is no question number " + this.currentStep);
    }

    this.noText = function() {
        // send back an empty string if noText is called and eligibility is known
        if (this.eligibilityKnown())
            return "";
        if (this.currentStep < ELIGIBILITY_FLOW.length);
            return ELIGIBILITY_FLOW[this.currentStep].no.text;
        // else if there is no question cooresponding to currentStep
        throw new Error("There is no question number " + this.currentStep);
    }

    this.submitYes = function() { 
        // record this question and answer in record and add to history
        var record = {};
        record.question = this.currentQuestion();
        record.answer = this.yesText();
        this.history.push(record);

        // update currentStep by following the yes path
        this.currentStep = ELIGIBILITY_FLOW[this.currentStep].yes.next;
    };

    this.submitNo = function() { 
        // record this question and answer in record and add to history
        var record = {};
        record.question = this.currentQuestion();
        record.answer = this.noText();
        this.history.push(record);

        // update currentStep by following the no path
        this.currentStep = ELIGIBILITY_FLOW[this.currentStep].no.next;
    };
})


// This controller controls the ineligible page. 
// There is currently just static content on this page
myApp.controller('eligibilityIneligibleController',
    ['$scope', 
        function ($scope) {
        
           
        }
]);

// This controller controls the eligible page. 
// There is currently just static content on this page
myApp.controller('eligibilityEligibleController',
    ['$scope', 
        function ($scope) {
        
           
        }
]);


// Partial 
myApp.controller('titlebarController',
    ['$scope', '$mdSidenav',
        function ($scope, $mdSidenav) {
            $scope.openLeftMenu = function() {
                $mdSidenav('left').toggle();
            };
            
            $scope.close = function() {
              $mdSidenav('left').toggle();
            }
           
        }
]);
