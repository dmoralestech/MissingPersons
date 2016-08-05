# MissingPersons
This is a sample project to replicate a missing persons application with ReactJS, WebPack, NodeJS, Restify, MongoDB, with Docker

##  Directory Structure

## Rest API ( useing restify and swagger )

    |____api 
    | |____index.js
    | |____lib
    | | |____config.js
    | |____log
    | |____models
    | | |____index.js
    | | |____porifle.spec.js
    | | |____profile.js
    | |____node_modules
    | |____package.json
    | |____routes
    | | |____login.js
    | | |____profile.js
    | |____ssl
    | |____swagger
    | | |____swagger.json
    | |____test

## ReactJS Client Build Directory ( bassed off of https://github.com/coryhouse/react-slingshot )

    |____client
    | |____appveyor.yml
    | |____docs
    | | |____FAQ.md
    | |____package.json
    | |____src
    | | |____actions
    | | | |____fuelSavingsActions.js
    | | | |____fuelSavingsActions.spec.js
    | | |____components
    | | | |____AboutPage.js
    | | | |____AboutPage.spec.js
    | | | |____App.js
    | | | |____FuelSavingsForm.js
    | | | |____FuelSavingsForm.spec.js
    | | | |____FuelSavingsResults.js
    | | | |____FuelSavingsResults.spec.js
    | | | |____FuelSavingsTextInput.js
    | | | |____FuelSavingsTextInput.spec.js
    | | | |____HomePage.js
    | | | |____NotFoundPage.js
    | | |____constants
    | | | |____actionTypes.js
    | | |____containers
    | | | |____FuelSavingsPage.js
    | | | |____FuelSavingsPage.spec.js
    | | |____favicon.ico
    | | |____index.ejs
    | | |____index.js
    | | |____reducers
    | | | |____fuelSavingsReducer.js
    | | | |____fuelSavingsReducer.spec.js
    | | | |____index.js
    | | | |____initialState.js
    | | |____routes.js
    | | |____store
    | | | |____configureStore.dev.js
    | | | |____configureStore.js
    | | | |____configureStore.prod.js
    | | | |____store.spec.js
    | | |____styles
    | | | |____about-page.css
    | | | |____styles.scss
    | | |____utils
    | | | |____dateHelper.js
    | | | |____dateHelper.spec.js
    | | | |____fuelSavingsCalculator.js
    | | | |____fuelSavingsCalculator.spec.js
    | | | |____mathHelper.js
    | | | |____mathHelper.spec.js
    | | | |____numberFormatter.js
    | | | |____numberFormatter.spec.js
    | | |____webpack-public-path.js
    | |____tools
    | | |____build.js
    | | |____chalkConfig.js
    | | |____distServer.js
    | | |____nodeVersionCheck.js
    | | |____removeDemo.js
    | | |____setup
    | | | |____setup.js
    | | | |____setupMessage.js
    | | | |____setupPrompts.js
    | | |____srcServer.js
    | | |____startMessage.js
    | | |____testSetup.js
    | |____webpack.config.dev.js
    | |____webpack.config.prod.js

### Web Server ( express )

    |____webserver 

### worker ( applications that listen to a message queue and perform some actions )

    |____worker 


### Docker configurations

    |____docker
    | |____mongo 
    | |____webserver 
    | |____ampmq
