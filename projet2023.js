/******************************************
           === variables globales === 
********************************************/
const EFFECTIF_MAX = 11; //effectif max pour une équipe
const POSTES = ["gardien","defenseur","milieu","attaquant"]; // noms des différents postes
const FORMATION_INITIALE="433"; // formation choisie par défaut au lancement

let joueurChoisi; // joueur choisi lors d'un click dans la zone joueurs

let playersData = playersDataFemme ;

/**
 * initialisation
 */
const init = function(){
    setupListenersExtra()   //Ajout pour le changement de banque de donnée pour le sexe des joueurs
    raz();
    remplirPostes(FORMATION_INITIALE);
    const ok = document.getElementById("ok");
    ok.addEventListener("click", changeFormation);
}


/*****************************************************
           === Réinitialisation de la page=== 
******************************************************/

/**
 * Mise à l'état initial (feuille de match, effectifs et joueurs)
 * lors d'un changement de formation
 */
const raz = function(){
    razZoneJoueurs();
    abonneClickJoueurs();
    viderFeuilleDeMatch()
    effectifsA0();
}

/**
 * vide la feuille de match
 */
const viderFeuilleDeMatch = function(){
    const fdm = document.getElementById('feuilleDeMatch').querySelector('ul') ;      // On pourrait utiliser getElementyTagName('ul') puis remplacer par la suite avec des fdm[0] 
    const li = fdm.getElementsByTagName('li')  ;                                    // const lis = fdm[0].getElementsByTagName('li')  ;  
    while ( li.length != 0) {
        fdm.removeChild(li[0])                                                    // fdm[0].removeChild(li[0])
    }
    // Pour que l'icone soit modifié lorsque la feuille est vidée
    changeImageComplete(false)
    
}

/**
 * Réinitialise tous les effectifs du tableau HTML à 0
 */
const effectifsA0=function(){
    const tr = document.getElementsByTagName('td') ;
    for ( let elem of tr) {
        elem.textContent = 0
      }
}

/** 
 * Vide la <div> d'id "joueurs" puis la remplit à partir des données
 * présentes dans le script utilisé : "men.js" ou "women.js"
 */
const razZoneJoueurs = function(){

    const joueurs = document.getElementById("joueurs");
    joueurs.innerHTML = "";
	for(let i = 0; i < playersData.length; i++) {
		joueurs.appendChild(creerJoueur(playersData[i]));
	} 
}

/*****************************************************
           ===Changement de formation=== 
******************************************************/

/**
 *  change la formation présente sur le terrain
 *  puis remet la page dans on état initial.
 */
const changeFormation = function(){
    
    const input = document.getElementById('formation');
    if(verifFormation(input.value)){
        remplirPostes(input.value) ;
        raz();
    }
}

/**
 * Détermine si la formation de l'équipe est valide
 * 3 caractères correspondants à des nombres entiers 
 * de défenseurs, milieu et attaquants sont attendus :
 * - Les défenseurs sont 3 au moins, 5 au plus
 * - Les milieux : 3 au moins, 5 au plus
 * - Les attaquants : 1 au moins, 3 au plus
 * (Le gardien est toujours unique il n'est pas représenté dans la chaine de caractères).
 * @param {String} formation - la formation à tester provenant de l'input correspondant
 * @return {Boolean} - true si la formation est valide, false sinon
 */
const verifFormation = function(formation){
    const valeurFormation = document.getElementById("formation").value ;
    //Verifier qu'il y a bien trois chiffres et que la somme fait 10
    
    if (valeurFormation.length == 3 ) { //On entre dans la première conditionnelle uniquement pour simplifier la lecture, nous pourrions tout faire sur une seule conditionnelle 
        const def = parseInt(valeurFormation[0]) ;
        const mid = parseInt(valeurFormation[1]) ;
        const atk = parseInt(valeurFormation[2]) ;
        if (def+mid+atk == 10 && 2<def<6 && 2<mid<6 && 0<atk<4 ) { return true ; }} 
    else { return false }

}


/**
 * Remplit les lignes de joueur en fonction de la formation choisie
 * @param {String} formation - formation d'équipe
 */
const remplirPostes = function(formation){
    const effectifs = [1]; // ajout du gardien
    for (c of formation)
        effectifs.push(parseInt(c))
    const lignes = document.getElementById("terrain").children
    for (let i=0; i<lignes.length ; i ++){
        lignes[i].innerHTML = ""
        for (let j = 0; j<effectifs[i]; j++){
            lignes[i].innerHTML +="<div class='positions "+POSTES[i]+"'></div>";
        }
    }
}

/*****************************************************
           === création des joueurs=== 
******************************************************/

/** Crée une <div> représentant un joueur avec un id de la forme "j-xxxxxx"
 * @param {Object} data - données d'un joueur
 * @return {HTMLElement} - div représentant un joueur
 */
const creerJoueur = function(data){
    
    //TODO créer une div joueur (attention aux attributs nécessaires)
    let player = document.createElement('div') ;
    player.className="joueur " + data['poste'];
	player.id = "j-"+(data['id']) ;

	// TODO créer l'image et l'ajouter  à la div joueur
    let image = document.createElement('img') ;
    image.src = data['src'] ;
    image.alt = data['nom'] ;
    player.appendChild(image) ;

    // TODO créer les <div> correspondants au nom et au poste et les ajouter  à la div joueur
    let infoNom = document.createElement('div') ;
    infoNom.innerHTML = data['nom'] ; 
    infoNom.className= "nom" ; 
    player.appendChild(infoNom) ;

    let infoRole = document.createElement('div') ;
    infoRole.innerHTML = data['poste'] ;
    infoRole.className="poste" ;
    player.appendChild(infoRole) ;
    
    return player
}


/*****************************************************
           ===Sélection des joueurs=== 
******************************************************/

/** 
 * Abonne les <div> de class "joueur" à la fonction selectionneJoueur pour un click
 */
const abonneClickJoueurs = function(){
    // Crée une liste contenant les noeuds de la classe .joueur dans la div#joueurs
    const joueurs = document.getElementById("joueurs");
    const liste = joueurs.querySelectorAll('.joueur') ;

    //Ajoute un écouteur d'évenement à tous les élements de la liste
    for (const elem of liste)
     elem.addEventListener('click',selectionneJoueur) ;
}

/** 
 * Selectionne un joueur, change son opacité puis le place sur le terrain
 */
const selectionneJoueur = function(){
    joueurChoisi = this;
    this.style.opacity="0.3";
    placeJoueur();
}


/*************************************************************
           ===Modifications des joueurs sur le terrain=== 
************************************************************/

/**
 * Renvoie le noeud DOM correspondant à la position disponible pour placer un
 *  joueur sur le terrain ou null si aucune n'est disponible
 * @param {HTMLElement} ligne - une div ligne de joueurs sur le terrain
 * @returns {HTMLElement || null} - une div de class "positions" disponible dans cette ligne
 */
const trouveEmplacement = function(ligne){
    //On regarde les fils du noeud ligne, on renvoie le premier fils qui n'a pas d'id
    const div = ligne.querySelector('div[class]:not([id]), div[class][id=""]') ;
    return div
}

/**
 * Renvoie le noeud DOM correspondant à la 
 * ligne où placer un joueur qur le terrain en fonction de son poste
 * @param {String} poste - poste du joueur
 * @returns {HTMLElement} - une div parmi les id #ligne...
 */
const trouveLigne = function(poste){
    return document.getElementById("ligne" + poste.substring(0,1).toUpperCase() +poste.substring(1));
}


/** 
 * Place un joueur sélectionné par un click sur la bonne ligne
 * dans une <div> de class "positions" avec un id de la forme "p-xxxxx"
 */
const placeJoueur = function(){
    
    const poste = joueurChoisi.classList[1] // le poste correspond à la 2ème classe;
    const ligne = trouveLigne(poste);
    const emplacementLibre = trouveEmplacement(ligne)
    if (emplacementLibre){
        // ajoute le nom du joueur et appelle la fonction permettant de mettre à jour la 
        // feuille de match
        const nom = joueurChoisi.querySelector(".nom").textContent;
        const id = joueurChoisi.id ;
        emplacementLibre.title = nom;
        ajouteJoueurListe(nom, id);

        //Modifier l'image de l'emplacement Libre
        const url = joueurChoisi.querySelector('img').src ;
        emplacementLibre.style.backgroundImage = "url('"+ url + "')" ;

        // Modifier l'id 
        emplacementLibre.id = id ;

        // Empecher le click dans la zone joueur, et autorise celui dans la zone terrain
        // pour le joueur choisi 
        emplacementLibre.addEventListener('click', deselectionneCompo);
        joueurChoisi.removeEventListener("click", selectionneJoueur );

        // mise à jour des effectifs de la table )
        miseAJourNeffectifs(poste, true);
    }
    else     
        joueurChoisi.style.opacity="";
}


/** 
 * Enlève du terrain le joueur sélectionné par un click
*/
const deselectionneCompo = function(){
    const poste = this.classList[1];
    const idJoueur = "j-" + this.id.substring(2);
    const joueur = document.getElementById(idJoueur);
    joueur.style.opacity="";
    joueur.addEventListener('click', selectionneJoueur);
    enleveJoueurFeuilleMatch(this.title);
    this.removeEventListener("click", deselectionneCompo);
    this.title="";
    this.style="";
    this.id="";
    enleveJoueurFeuilleMatch()
    miseAJourNeffectifs(poste, false);

    //Si le joueur est capitaine, supprimer la balise image du capitaine
    if (this.childNodes.length > 0) {this.removeChild(this.childNodes[0])}

   
}

/*************************************************************
           ===Mise à jour des effectifs=== 
************************************************************/

/**
 * Met à jour les effectifs dans le tableau lorsqu'un joueur est ajouté 
 * ou retiré du terrain.
 * Après chaque modification, une vérification de la composition compléte
 * doit être effectuée et le changement d'image de la feuille de match
 * doit être éventuellement réalisé.
 * @param {String} poste - poste du joueur
 * @param {Boolean} plus - true si le joueur est ajouté, false s'il est retiré
 */
const miseAJourNeffectifs = function(poste, plus){
    const tr = document.getElementsByTagName('td') ;

    // Regarde dans un premier temps si la compo est complète avant modification
    const complet1 = verifCompoComplete() ;

    if (plus) {
        // Ajoute 1 à la case du tableau correspondant au rôle
        for ( const elem of tr) {
            if (elem.className == poste) { elem.textContent = parseInt(elem.textContent)+1}}

    }
    else {
        // Retire 1 à la case du tableau correspondant au rôle
        for ( const elem of tr) {
            if (elem.className == poste) { elem.textContent = parseInt(elem.textContent)-1}
    }}
    // Regarde dans une seconde fois après modification
    const complet2 = verifCompoComplete() ;
    if (complet2 != complet1) {changeImageComplete(complet2)}
}


/**
 * Verifie si l'effectif est complet.
 * L'image de la feuille de match est changée en conséquence.
 * @returns {Boolean} - true si l'effectif est au complet, false sinon
 */
const verifCompoComplete = function(){
    const tr = document.getElementsByTagName('td') ;
    let somme = 0 ;
    for ( elem of tr ) {
        somme += parseInt(elem.textContent)}

    return somme == 11 

    //Autre version qui verifie directement avec la feuille de match
     /*
    const fdm = document.getElementById('feuilleDeMatch').querySelector('ul') ;
    const li = fdm.getElementsByTagName('li')  ;
    return li.length == 11
    */
}

/*************************************************************
           ===Mise à jour de la feuille de match=== 
************************************************************/

/**
 * Modifie l'image de la feuille de match
 * en fonction de la taille de l'effectif
 * @param {Boolean} complet - true si l'effectif est complet, false sinon
 */
const changeImageComplete = function(complet){

    const image = document.getElementById('check') ;

    if (complet) {
        image.src = "./images/check.png"
    }
    else {
        image.src = "./images/notok.png"
    }
}


/**
 * Enleve un joueur de la feuille de match
 * @param {String} nom - nom du joueur à retirer
 */
const enleveJoueurFeuilleMatch = function(nom){
    const fdm = document.getElementById('feuilleDeMatch').querySelector('ul') ;  // On pourrait utiliser getElementyTagName('ul') puis remplacer par la suite avec des fdm[0] 
    const li = fdm.getElementsByTagName('li')  ;                                 // const lis = fdm[0].getElementsByTagName('li')  ;  
    for ( let elem of li) {
        if (elem.textContent == nom ) {
            fdm.removeChild(elem) ;                                              // fdm[0].removeChild(elem) ;
        }
    }
}

/**
 * ajoute un joueur à la feuille de match dans un élément
 * <li> avec un id de la forme "f-xxxxx"
 * @param {String} nom - nom du joueur
 * @param {String} id - id du joueur ajouté au terrain de la forme "p-xxxxx"
 */
const ajouteJoueurListe = function(nom, id){
    const liste = document.getElementById('feuilleDeMatch').querySelector('ul');
    const li = document.createElement('li');
    li.textContent = nom ;
    li.id =  "f-"+id.substring(2) ;
    liste.appendChild(li) ;
}


/*************************************************************
           ===Extra=== 
************************************************************/


/**
 * Setup les ecouteurs d'évenement pour les fonctions extras
 */
function setupListenersExtra() {
    const sexe = document.getElementById('sexe') ;
    const capi = document.getElementById('capitaine') ;

    capi.addEventListener('click',choisirCap)
    sexe.addEventListener('click',changeSexe)

}

//Fonction pour changer le sexe des joueurs


/**
 * Change la base de donnée utilisée, et le texte affiché sur le bouton
 */
function changeSexe() {
    if (playersData == playersDataFemme) {

        playersData = playersDataHomme ;
        sexe.textContent = "Vers Feminin" ;
    }
    else {
        playersData = playersDataFemme ;
        sexe.textContent = "Vers Masculin" ;
    }
    changeFormation()
}

//Fonction pour choisir un Capitaine :


const terrain = document.getElementById('terrain') ;    //Constante pour les fonctions



/**
 * Fonction actionée au click sur le bouton capitaine, vérifie qu'il n'y ait pas déjà de capitaine et qu'il y ait au moins un joueur sur le terrain, change le curseur et rends les joueurs sélectionnables 
 */
function choisirCap() {

    const imageBrassart = document.getElementById('imgcap') ;
    if (!imageBrassart) {
    

    //Rends assignable le brassart de capitaine aux joueurs présents sur le terrain
    const places = terrain.querySelectorAll('div[class][id^=j]') ;
    if (places.length > 0){
    for (place of places) {
    place.removeEventListener('click',deselectionneCompo)
    place.addEventListener('click',placeBrassart)}
    
    //Change le curseur
    loadCursor()
    }}
}


/**
 * Place le brassart de capitaine sur un joueur du terrain
 */
function placeBrassart() {

    //Rétablit le curseur
    document.body.style.cursor  = "auto" ;
    
    //Rétablit les
    const places = terrain.querySelectorAll('div[class][id^=j]') ;
    for (place of places) {
    place.removeEventListener('click',placeBrassart) ;
    place.addEventListener('click',deselectionneCompo)}
    
    // Ajoute le brassart à l'icone du capitaine 

    this.style.position = "relative" ; //Permet l'utilisation de la position absolut pour ses fils
    
    let image = document.createElement('img') ; //Création de la balise image, ajout d'id et de sources
    image.id = "imgcap" ;
    image.src = "./images/curseur-bra.png" ;
    this.appendChild(image) ;                   //Ajouter la balise au joueur sélectionné 
    
}

/**
 * Permet de changer le curseur
 */
function loadCursor() {
    document.body.style.cursor  = "url('./images/curseur-bra.cur'), crosshair" ;
    }


/*************************************************************
           ===Initialisation de la page=== 
************************************************************/

init();